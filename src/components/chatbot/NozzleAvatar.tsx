'use client'

import Image from 'next/image'
import nozzleImg from '@/assets/avatar/Gemini_Generated_Image_8bjjwd8bjjwd8bjj.png'

interface NozzleAvatarProps {
  size?: number
  className?: string
  /** Preenche o container pai (pai deve ser relative + overflow-hidden) */
  fill?: boolean
  /** Posição do foco da imagem — padrão: rosto do mascote */
  objectPosition?: string
}

export function NozzleAvatar({
  size = 32,
  className = '',
  fill: fillMode = false,
  objectPosition = '50% 28%',
}: NozzleAvatarProps) {
  if (fillMode) {
    return (
      <Image
        src={nozzleImg}
        alt=""
        fill
        sizes="100%"
        className={`object-cover ${className}`}
        style={{ objectPosition }}
        aria-hidden
        priority
      />
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src={nozzleImg}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
        style={{ objectPosition }}
        priority
      />
    </div>
  )
}
