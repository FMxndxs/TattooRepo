'use client'

interface NozzleAvatarProps {
  size?: number
  className?: string
}

/**
 * Nozzle — the Imagination 3D chatbot mascot.
 * An SVG of a 3D printer nozzle with a filament drop.
 */
export function NozzleAvatar({ size = 32, className = '' }: NozzleAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Nozzle body */}
      <rect x="9" y="4" width="14" height="10" rx="2" fill="url(#nozzle-body)" />
      {/* Nozzle tip (trapezoid) */}
      <path d="M11 14 L21 14 L19 20 L13 20 Z" fill="url(#nozzle-tip)" />
      {/* Nozzle hole */}
      <rect x="14.5" y="19" width="3" height="2" rx="1" fill="#431370" />
      {/* Filament drop */}
      <ellipse cx="16" cy="24" rx="2" ry="3" fill="url(#filament-drop)" className="animate-pulse" />
      {/* Highlight line */}
      <rect x="11" y="7" width="4" height="1.5" rx="0.75" fill="white" opacity="0.15" />

      <defs>
        <linearGradient id="nozzle-body" x1="9" y1="4" x2="23" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#431370" />
        </linearGradient>
        <linearGradient id="nozzle-tip" x1="11" y1="14" x2="21" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6a2ba8" />
          <stop offset="1" stopColor="#2d0d4e" />
        </linearGradient>
        <linearGradient id="filament-drop" x1="14" y1="21" x2="18" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b683ff" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  )
}
