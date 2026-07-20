'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, PerformanceMonitor } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'
import { PrintedObject } from './PrintedObject'
import { usePrintLoop } from './usePrintLoop'
import type { GraphicsQuality } from './useGraphicsQuality'

interface PrinterSceneProps {
  reducedMotion: boolean
  quality: GraphicsQuality
  onFirstPrintComplete?: () => void
  onBuildNearComplete?: () => void
}

const FRAME_COLOR = '#27272a' // zinc-800 — mesmo neutro usado no resto do tema 3D
const ACCENT_COLOR = '#6a2ba8' // brand-500
const PEDESTAL_RADIUS = 0.85
const PEDESTAL_HEIGHT = 0.14

const BASE_CAMERA_POSITION = new THREE.Vector3(2.7, 1.9, 3.5)
const BASE_FOV = 38
const FOCUS_PULL_FOV = 2.5 // quantos graus a câmera "aperta" ao concluir a peça
const BASE_RADIUS = Math.hypot(BASE_CAMERA_POSITION.x, BASE_CAMERA_POSITION.z)
const BASE_ANGLE = Math.atan2(BASE_CAMERA_POSITION.z, BASE_CAMERA_POSITION.x)
const ORBIT_SPEED = 0.045 // rad/s — bem lento, "respirando" ao redor da cena
const DOLLY_AMOUNT = 0.3 // quanto a câmera se aproxima ao concluir a peça
const CAMERA_SMOOTH_TIME = 0.4 // segundos — easing.damp3, independente de frame-rate
const FOV_SMOOTH_TIME = 0.5

/**
 * Cena de vitrine: um pedestal simples com a peça (vaso/escultura/decoração
 * geométrica, ciclando conforme `models.ts`) se revelando aos poucos — sem
 * impressora, sem bico. Câmera em órbita lenta com dolly-in + focus-pull sutil
 * (via `maath` easing, independente de frame-rate) e parallax pelo ponteiro,
 * como uma foto de produto em movimento.
 */
export function PrinterScene({ reducedMotion, quality, onFirstPrintComplete, onBuildNearComplete }: PrinterSceneProps) {
  const loopRef = usePrintLoop(reducedMotion, onFirstPrintComplete, onBuildNearComplete)
  const { camera, setDpr } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 0.15, 0))

  const targetPosition = useMemo(() => new THREE.Vector3(), [])

  // Glow radial estático sob o pedestal — "reflexo falso" barato, sem render target
  const glowTexture = useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      gradient.addColorStop(0, 'rgba(106, 43, 168, 0.55)')
      gradient.addColorStop(0.5, 'rgba(67, 19, 112, 0.22)')
      gradient.addColorStop(1, 'rgba(67, 19, 112, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera

    if (!reducedMotion) {
      const t = state.clock.getElapsedTime()
      const { buildProgress } = loopRef.current

      // Câmera cinematográfica: órbita lenta contínua + dolly-in sutil ao concluir a peça
      const orbitAngle = BASE_ANGLE + t * ORBIT_SPEED
      const radius = BASE_RADIUS - DOLLY_AMOUNT * buildProgress
      targetPosition.set(
        Math.cos(orbitAngle) * radius,
        BASE_CAMERA_POSITION.y + Math.sin(t * 0.12) * 0.18,
        Math.sin(orbitAngle) * radius
      )

      // Parallax sutil por cima da órbita: câmera segue o ponteiro com amortecimento
      const { pointer } = state
      targetPosition.x += pointer.x * 0.5
      targetPosition.y += pointer.y * 0.3

      // damp3 é independente de frame-rate (sem jitter) e redireciona suavemente
      // se o alvo mudar no meio do movimento — troca o lerp manual de antes.
      easing.damp3(camera.position, targetPosition, CAMERA_SMOOTH_TIME, delta)

      // Focus-pull: leve fechamento de FOV que "pousa" exatamente quando a peça termina
      const targetFov = BASE_FOV - FOCUS_PULL_FOV * buildProgress
      easing.damp(perspectiveCamera, 'fov', targetFov, FOV_SMOOTH_TIME, delta)
      perspectiveCamera.updateProjectionMatrix()
    } else {
      camera.position.copy(BASE_CAMERA_POSITION)
      perspectiveCamera.fov = BASE_FOV
      perspectiveCamera.updateProjectionMatrix()
    }
    camera.lookAt(lookTarget.current)
  })

  return (
    <>
      {/* Reage a quedas de FPS reduzindo o dpr — complementa a heurística estática de useGraphicsQuality */}
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(quality.highGraphics ? 1.5 : 1.25)}
      />

      <ambientLight intensity={0.8} color="#e6d9ff" />
      <hemisphereLight args={['#c9b3ff', '#0a0612', 0.7]} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} color="#ffffff" castShadow />
      <directionalLight position={[-3, 2, -4]} intensity={0.5} color="#b683ff" />

      <group position={[0, -1.1, 0]}>
        {/* Pedestal — vitrine simples, sem impressora */}
        <mesh position={[0, -PEDESTAL_HEIGHT / 2, 0]} receiveShadow>
          <cylinderGeometry args={[PEDESTAL_RADIUS, PEDESTAL_RADIUS, PEDESTAL_HEIGHT, 48]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.55} metalness={0.4} />
        </mesh>
        <mesh position={[0, -0.005, 0]}>
          <cylinderGeometry args={[PEDESTAL_RADIUS - 0.04, PEDESTAL_RADIUS - 0.04, 0.012, 48]} />
          <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.25} roughness={0.4} />
        </mesh>

        <PrintedObject loopRef={loopRef} highGraphics={quality.highGraphics} reducedMotion={reducedMotion} />

        {/* Chão fosco — barato; o "reflexo" é simulado pelo glow radial abaixo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -PEDESTAL_HEIGHT - 0.05, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#08060c" roughness={0.95} />
        </mesh>

        {/* Glow radial estático — vende o brilho da vitrine no chão sem custo por frame */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -PEDESTAL_HEIGHT - 0.045, 0]}>
          <planeGeometry args={[7, 7]} />
          <meshBasicMaterial map={glowTexture} transparent depthWrite={false} />
        </mesh>

        {/* Sombra de contato congelada (frames=1): o pedestal é estático, não precisa re-renderizar */}
        <ContactShadows
          position={[0, -PEDESTAL_HEIGHT - 0.04, 0]}
          opacity={0.6}
          scale={9}
          blur={2.2}
          far={3}
          resolution={256}
          frames={1}
          color="#000000"
        />
      </group>
    </>
  )
}
