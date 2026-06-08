'use client'

interface StockToggleProps {
  available: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function StockToggle({ available, onChange, disabled = false }: StockToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={available}
        disabled={disabled}
        onClick={() => onChange(!available)}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 ${
          available ? 'bg-green-500' : 'bg-zinc-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            available ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${available ? 'text-green-400' : 'text-zinc-400'}`}>
        {available ? 'Disponível' : 'Indisponível'}
      </span>
    </div>
  )
}
