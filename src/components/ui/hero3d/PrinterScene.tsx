'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Printer } from './Printer'
import { PrintedObject } from './PrintedObject'
import { usePrintLoop } from './usePrintLoop'
import type { GraphicsQuality } from './useGraphicsQuality'

interface PrinterSceneProps {
  reducedMotion: boolean
  quality: GraphicsQuality
  onFirstPrintComplete?: () => void
}

const BASE_CAMERA_POSITION = new THREE.Vector3(3.0, 2.2, 4.0)
const BASE_RADIUS = Math.hypot(BASE_CAMERA_POSITION.x, BASE_CAMERA_POSITION.z)
const BASE_ANGLE = Math.atan2(BASE_CAMERA_POSITION.z, BASE_CAMERA_POSITION.x)
const ORBIT_SPEED = 0.045 // rad/s — bem lento, "respirando" ao redor da cena
const DOLLY_AMOUNT = 0.45 // quanto a câmera se aproxima ao concluir a peça

export function PrinterScene({ reducedMotion, onFirstPrintComplete }: PrinterSceneProps) {
  const loopRef = usePrintLoop(reducedMotion, onFirstPrintComplete)
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 1.1, 0))

  const targetPosition = useMemo(() => new THREE.Vector3(), [])

  // Glow radial estático sob a impressora — "reflexo falso" barato, sem render target
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

  useFrame((state) => {
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

      camera.position.lerp(targetPosition, 0.035)
    } else {
      camera.position.lerp(BASE_CAMERA_POSITION, 1)
    }
    camera.lookAt(lookTarget.current)
  })

  return (
    <>
      <ambientLight intensity={0.55} color="#e6d9ff" />
      <hemisphereLight args={['#c9b3ff', '#0a0612', 0.5]} />
      <directionalLight position={[4, 6, 3]} intensity={0.9} color="#ffffff" castShadow />
      <directionalLight position={[-3, 2, -4]} intensity={0.35} color="#b683ff" />

      <group position={[0, -1.1, 0]}>
        <Printer loopRef={loopRef} />
        <PrintedObject loopRef={loopRef} />

        {/* Chão fosco — barato; o "reflexo" é simulado pelo glow radial abaixo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#08060c" roughness={0.95} />
        </mesh>

        {/* Glow radial estático — vende o brilho da máquina no chão sem custo por frame */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]}>
          <planeGeometry args={[7, 7]} />
          <meshBasicMaterial map={glowTexture} transparent depthWrite={false} />
        </mesh>

        {/* Sombra de contato congelada (frames=1): a mesa é estática, não precisa re-renderizar */}
        <ContactShadows
          position={[0, -0.04, 0]}
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
