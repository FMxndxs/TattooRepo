'use client'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-4 py-2 bg-brand-700 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-colors"
    >
      Imprimir (Ctrl+P)
    </button>
  )
}
