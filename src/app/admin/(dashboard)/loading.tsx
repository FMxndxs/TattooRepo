/**
 * admin/(dashboard)/loading.tsx — spinner para transições no painel admin.
 */
export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-[60vh]" aria-label="Carregando…">
      <span
        className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-brand-300 animate-spin"
        aria-hidden="true"
      />
    </div>
  )
}
