'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { PRINT_OBJECT_HEIGHT } from './shapes'
import { PRINT_MODELS, type PrintModelId } from './models'
import type { PrintLoopState } from './usePrintLoop'

const FUSION_COLOR = new THREE.Color('#b683ff')

interface FusionUniforms {
  uCutHeight: { value: number }
  uEdgeColor: { value: THREE.Color }
  uRimColor: { value: THREE.Color }
  uBuildProgress: { value: number }
}

/**
 * Injeta a "linha de fusão" (banda emissiva viajando na altura de corte atual),
 * um Fresnel rim-light sutil (só acende perto do fim do build) e um contorno de
 * camadas quase imperceptível — tudo via `onBeforeCompile` sobre o
 * `MeshStandardMaterial` já clonado por malha, sem shader/material novo. Retorna
 * os uniforms (ou `null` se o material não for um MeshStandardMaterial) para
 * atualização por frame em `PrintedObject`.
 */
function injectFusionShader(material: THREE.Material): FusionUniforms | null {
  const standardMaterial = material as THREE.MeshStandardMaterial
  if (!standardMaterial.isMeshStandardMaterial) return null

  const uniforms: FusionUniforms = {
    uCutHeight: { value: 0 },
    uEdgeColor: { value: FUSION_COLOR.clone() },
    uRimColor: { value: FUSION_COLOR.clone() },
    uBuildProgress: { value: 0 },
  }

  standardMaterial.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;'
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vWorldPos;
uniform float uCutHeight;
uniform vec3 uEdgeColor;
uniform vec3 uRimColor;
uniform float uBuildProgress;`
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
  // Linha de fusão: banda emissiva bem fina na altura de corte atual
  float distToEdge = uCutHeight - vWorldPos.y;
  float edgeGlow = 1.0 - smoothstep(0.0, 0.05, abs(distToEdge));
  gl_FragColor.rgb += uEdgeColor * edgeGlow * 1.8;

  // Contorno de camadas: textura sutilíssima, não listras visíveis
  float layerLine = sin(vWorldPos.y * 42.0) * 0.5 + 0.5;
  gl_FragColor.rgb += uEdgeColor * layerLine * 0.012;

  // Fresnel rim-light — só acende perto do fim do build
  float fresnelTerm = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 2.5);
  gl_FragColor.rgb += uRimColor * fresnelTerm * 0.45 * uBuildProgress;`
      )
  }
  standardMaterial.needsUpdate = true

  return uniforms
}

interface NormalizedModel {
  /** Cena clonada, já escalada/centralizada para caber em `PRINT_OBJECT_HEIGHT` com a base em y=0. */
  group: THREE.Object3D
  /** Uniforms da linha de fusão de cada malha do modelo — atualizados por frame. */
  fusionUniforms: FusionUniforms[]
}

/**
 * Clona a cena GLTF carregada, injeta o clip plane compartilhado + a linha de
 * fusão em cada malha (clonando o material — `useGLTF` cacheia por URL, mutar
 * in-place vazaria o clipping/shader para qualquer outro uso do mesmo asset) e
 * normaliza escala/posição por bounding box para que QUALQUER modelo cresça de
 * 0 (nada) a `PRINT_OBJECT_HEIGHT` (inteiro) com a base apoiada no chão (y=0),
 * independente da unidade/orientação de origem do arquivo.
 */
function useNormalizedModel(scene: THREE.Object3D, clipPlane: THREE.Plane): NormalizedModel {
  return useMemo(() => {
    const clone = scene.clone(true)
    const fusionUniforms: FusionUniforms[] = []

    const cloneAndInject = (m: THREE.Material) => {
      const cloned = m.clone()
      cloned.clippingPlanes = [clipPlane]
      cloned.clipShadows = true
      cloned.needsUpdate = true
      const uniforms = injectFusionShader(cloned)
      if (uniforms) fusionUniforms.push(uniforms)
      return cloned
    }

    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return

      const sourceMaterial = mesh.material as THREE.Material | THREE.Material[]
      mesh.material = Array.isArray(sourceMaterial) ? sourceMaterial.map(cloneAndInject) : cloneAndInject(sourceMaterial)

      mesh.castShadow = true
      mesh.receiveShadow = true
    })

    const rawBox = new THREE.Box3().setFromObject(clone)
    const rawHeight = Math.max(0.0001, rawBox.max.y - rawBox.min.y)
    const scaleFactor = PRINT_OBJECT_HEIGHT / rawHeight

    clone.scale.setScalar(scaleFactor)
    // Centraliza em X/Z e apoia a base em y=0 — assim o clip plane em world space
    // pode ser sempre `buildProgress * PRINT_OBJECT_HEIGHT`, sem offsets por modelo.
    clone.position.set(
      -((rawBox.min.x + rawBox.max.x) / 2) * scaleFactor,
      -rawBox.min.y * scaleFactor,
      -((rawBox.min.z + rawBox.max.z) / 2) * scaleFactor
    )
    clone.visible = false

    return { group: clone, fusionUniforms }
  }, [scene, clipPlane])
}

interface PrintedObjectProps {
  loopRef: React.RefObject<PrintLoopState>
  /** Liga motes esparsos (drei Sparkles) — só em devices de tier alto. */
  highGraphics: boolean
  /** Desliga motes e qualquer motion residual sob prefers-reduced-motion. */
  reducedMotion: boolean
}

/**
 * O objeto "sendo criado": um modelo GLB real (peças no estilo do catálogo —
 * vaso, escultura, decoração geométrica — ciclando conforme `models.ts`) que se
 * revela de baixo pra cima via clipping plane animado, com uma "linha de fusão"
 * luminosa (banda emissiva + rim-light + contorno de camadas, via shader) e um
 * anel aditivo acompanhando a altura de corte. Os três modelos do ciclo ficam
 * pré-carregados e montados; só o ativo fica visível.
 */
export function PrintedObject({ loopRef, highGraphics, reducedMotion }: PrintedObjectProps) {
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const ringRef = useRef<THREE.Mesh>(null)
  const sparklesGroupRef = useRef<THREE.Group>(null)

  const vasoGltf = useGLTF(PRINT_MODELS.vaso.url)
  const esculturaGltf = useGLTF(PRINT_MODELS.escultura.url)
  const geometricoGltf = useGLTF(PRINT_MODELS.geometrico.url)

  const models: Record<PrintModelId, NormalizedModel> = {
    vaso: useNormalizedModel(vasoGltf.scene, clipPlane),
    escultura: useNormalizedModel(esculturaGltf.scene, clipPlane),
    geometrico: useNormalizedModel(geometricoGltf.scene, clipPlane),
  }

  // Halo aditivo do anel — mesma técnica de sprite aditivo já usada no resto do tema 3D
  const ringHaloTexture = useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      gradient.addColorStop(0, 'rgba(182, 131, 255, 0.9)')
      gradient.addColorStop(0.5, 'rgba(182, 131, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(182, 131, 255, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(() => {
    const { buildProgress, shape } = loopRef.current
    const cutHeight = buildProgress * PRINT_OBJECT_HEIGHT
    clipPlane.constant = cutHeight

    ;(Object.keys(models) as PrintModelId[]).forEach((id) => {
      const active = id === shape
      models[id].group.visible = active
      if (active) {
        models[id].fusionUniforms.forEach((u) => {
          u.uCutHeight.value = cutHeight
          u.uBuildProgress.value = buildProgress
        })
      }
    })

    if (ringRef.current) {
      const visible = cutHeight > 0.01 && cutHeight < PRINT_OBJECT_HEIGHT - 0.02
      ringRef.current.visible = visible
      if (visible) ringRef.current.position.y = cutHeight
    }

    if (sparklesGroupRef.current) {
      sparklesGroupRef.current.position.y = cutHeight
    }
  })

  return (
    <group>
      <primitive object={models.vaso.group} />
      <primitive object={models.escultura.group} />
      <primitive object={models.geometrico.group} />

      {/* Anel fino que reforça a linha de fusão — halo aditivo acompanhando a altura de corte */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.34, 32]} />
        <meshBasicMaterial
          color="#b683ff"
          map={ringHaloTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Motes esparsos subindo com a linha de fusão — só em devices de tier alto, nunca em reduced-motion */}
      {highGraphics && !reducedMotion && (
        <group ref={sparklesGroupRef}>
          <Sparkles count={24} scale={[0.9, 0.15, 0.9]} size={2.5} speed={0.3} color="#b683ff" opacity={0.5} />
        </group>
      )}
    </group>
  )
}
