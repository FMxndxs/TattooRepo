'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildLatheProfile, shapeRadiusAt, PRINT_OBJECT_HEIGHT, PRINT_RADIAL_SEGMENTS, type PrintShapeName } from './shapes'
import type { PrintLoopState } from './usePrintLoop'

const BRAND_FILAMENT = '#b683ff'
const BRAND_STRUCTURE = '#431370'

interface PrintedObjectProps {
  loopRef: React.RefObject<PrintLoopState>
}

/**
 * O objeto "sendo impresso": cresce de baixo pra cima via clipping plane animado,
 * com um anel brilhante ("camada quente") acompanhando a altura atual — vende o
 * efeito de impressão em time-lapse sem precisar de um shader por camada.
 */
export function PrintedObject({ loopRef }: PrintedObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const currentShapeRef = useRef<PrintShapeName>(loopRef.current.shape)

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])

  const geometries = useMemo(() => {
    const map = new Map<PrintShapeName, THREE.LatheGeometry>()
    ;(['vaso', 'ampulheta', 'taca'] as PrintShapeName[]).forEach((shape) => {
      const profile = buildLatheProfile(shape).map((p) => new THREE.Vector2(p.x, p.y))
      const geometry = new THREE.LatheGeometry(profile, PRINT_RADIAL_SEGMENTS)
      geometry.computeVertexNormals()
      map.set(shape, geometry)
    })
    return map
  }, [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: BRAND_STRUCTURE,
        emissive: new THREE.Color(BRAND_FILAMENT).multiplyScalar(0.12),
        roughness: 0.35,
        metalness: 0.15,
        clippingPlanes: [clipPlane],
        clipShadows: true,
      }),
    [clipPlane]
  )

  useFrame(() => {
    const { buildProgress, shape } = loopRef.current
    const height = buildProgress * PRINT_OBJECT_HEIGHT

    // Corta tudo acima da altura já "impressa"
    clipPlane.constant = height

    if (currentShapeRef.current !== shape && meshRef.current) {
      const geometry = geometries.get(shape)
      if (geometry) meshRef.current.geometry = geometry
      currentShapeRef.current = shape
    }

    if (ringRef.current) {
      const visible = height > 0.01 && height < PRINT_OBJECT_HEIGHT - 0.02
      ringRef.current.visible = visible
      if (visible) {
        const t = height / PRINT_OBJECT_HEIGHT
        const radius = Math.max(0.02, shapeRadiusAt(shape, t)) * 0.85
        ringRef.current.position.y = height
        ringRef.current.scale.setScalar(radius / 0.3)
      }
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometries.get(loopRef.current.shape)} material={material} castShadow receiveShadow />
      {/* Anel da "camada quente" — acompanha o topo do objeto enquanto ele cresce */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 24]} />
        <meshStandardMaterial color={BRAND_FILAMENT} emissive={BRAND_FILAMENT} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </group>
  )
}
