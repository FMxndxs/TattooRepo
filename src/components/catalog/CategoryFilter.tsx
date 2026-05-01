'use client'

import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selected: string | null
  onSelect: (slug: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-brand-700 text-white'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        }`}
      >
        Todos
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === category.slug
              ? 'bg-brand-700 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
