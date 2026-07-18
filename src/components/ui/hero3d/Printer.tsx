'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PRINT_OBJECT_HEIGHT, shapeRadiusAt } from './shapes'
import { Filament } from './Filament'
import type { PrintLoopState } from './usePrintLoop'

const FRAME_COLOR = '#27272a' // zinc-800 — corpo neutro da impressora
const ACCENT_COLOR = '#6a2ba8' // brand-500
const NOZZLE_HOT = '#ffb27a'

const BED_RADIUS = 1.35
const FRAME_HEIGHT = PRINT_OBJECT_HEIGHT + 1.1

interface PrinterProps {
  loopRef: React.RefObject<PrintLoopState>
}

/**
 * Impressora procedural (primitivos three.js): mesa aquecida, colunas, trilho (gantry)
 * e bico (toolhead) que sobe acompanhando a altura já impressa e desliza em X/Y
 * simulando o movimento de deposição de filamento.
 */
export function Printer({ loopRef }: PrinterProps) {
  const toolheadRef = useRef<THREE.Group>(null)
  const nozzleLightRef = useRef<THREE.PointLight>(null)
  const filamentRef = useRef<THREE.Mesh>(null)

  // Halo aditivo do bico — substitui o bloom (post-processing) por um sprite barato
  const haloTexture = useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      gradient.addColorStop(0, 'rgba(255, 178, 122, 0.9)')
      gradient.addColorStop(0.4, 'rgba(255, 178, 122, 0.35)')
      gradient.addColorStop(1, 'rgba(255, 178, 122, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    const { buildProgress, phase, shape } = loopRef.current
    if (!toolheadRef.current) return

    const height = buildProgress * PRINT_OBJECT_HEIGHT
    const t = clock.getElapsedTime()

    // Movimento rápido de "varredura" do bico enquanto constrói; parado no hold/reset
    const sweeping = phase === 'build'
    const radius = Math.max(0.05, shapeRadiusAt(shape, Math.min(1, buildProgress))) * 0.85
    const angle = sweeping ? t * 6.5 : 0
    const toolheadX = sweeping ? Math.cos(angle) * radius * 0.9 : 0
    const toolheadZ = sweeping ? Math.sin(angle) * radius * 0.9 : 0

    toolheadRef.current.position.set(toolheadX, height + 0.18, toolheadZ)

    if (nozzleLightRef.current) {
      nozzleLightRef.current.intensity = sweeping ? 1.6 + Math.sin(t * 14) * 0.4 : 0.6
    }

    // Fio de filamento: liga a ponta do bico à camada que está sendo depositada agora
    if (filamentRef.current) {
      filamentRef.current.visible = sweeping
      if (sweeping) {
        const nozzleTipY = height + 0.05
        filamentRef.current.position.set(toolheadX, (nozzleTipY + height) / 2, toolheadZ)
        filamentRef.current.scale.set(1, 0.08, 1)
      }
    }
  })

  return (
    <group>
      {/* Mesa de impressão (build plate) */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[BED_RADIUS, BED_RADIUS, 0.06, 48]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[BED_RADIUS - 0.04, BED_RADIUS - 0.04, 0.01, 48]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.25} roughness={0.4} />
      </mesh>

      {/* Colunas do frame (4 cantos) */}
      {[
        [1.55, 1.55],
        [-1.55, 1.55],
        [1.55, -1.55],
        [-1.55, -1.55],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, FRAME_HEIGHT / 2 - 0.1, z]} castShadow>
          <boxGeometry args={[0.08, FRAME_HEIGHT, 0.08]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Trilho superior (gantry) — barra fixa no topo, decorativa */}
      <mesh position={[0, FRAME_HEIGHT - 0.15, 0]}>
        <boxGeometry args={[3.3, 0.09, 0.09]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Toolhead / bico — sobe com a altura impressa e "varre" durante o build */}
      <group ref={toolheadRef} position={[0, 0.18, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.16, 0.22]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.13, 0]}>
          <coneGeometry args={[0.05, 0.12, 12]} />
          <meshStandardMaterial color={NOZZLE_HOT} emissive={NOZZLE_HOT} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        <pointLight ref={nozzleLightRef} color={NOZZLE_HOT} intensity={1.2} distance={1.4} position={[0, -0.15, 0]} />
        <sprite position={[0, -0.15, 0]} scale={[0.35, 0.35, 1]}>
          <spriteMaterial map={haloTexture} blending={THREE.AdditiveBlending} depthWrite={false} transparent />
        </sprite>
      </group>

      {/* Fio de filamento sendo extrudado — visível só durante o build */}
      <Filament ref={filamentRef} />
    </group>
  )
}
