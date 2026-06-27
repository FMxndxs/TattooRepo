/**
 * Root loading.tsx — exibido pelo React Suspense durante navegações.
 * Reutilizável, respeita a cor brand.
 */
export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" aria-label="Carregando…">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner com cor brand */}
        <span
          className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-brand-300 animate-spin"
          aria-hidden="true"
        />
        <p className="text-zinc-500 text-sm">Carregando…</p>
      </div>
    </div>
  )
}
