'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selected: string | null
  onSelect: (slug: string | null) => void
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      whileHover={reduced ? undefined : { y: -1 }}
      className={`relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium ring-1 transition-colors duration-200 ${
        active
          ? 'bg-brand-700 text-white ring-brand-400/55 shadow-[0_0_20px_-4px_rgba(182,131,255,0.65)]'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ring-zinc-700/80 hover:text-white'
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-1 h-px rounded-full bg-gradient-to-r from-transparent via-brand-200/95 to-transparent"
        />
      )}
      <span className="relative">{children}</span>
    </motion.button>
  )
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill active={selected === null} onClick={() => onSelect(null)}>
        Todos
      </Pill>

      {categories.map((category) => (
        <Pill key={category.id} active={selected === category.slug} onClick={() => onSelect(category.slug)}>
          {category.name}
        </Pill>
      ))}
    </div>
  )
}
