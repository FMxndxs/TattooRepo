/**
 * product/[slug]/loading.tsx — skeleton para a página de detalhe do produto.
 */
export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" aria-label="Carregando produto…">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
        {/* Imagem */}
        <div className="aspect-square rounded-2xl bg-zinc-800/60" aria-hidden="true" />

        {/* Detalhes */}
        <div className="space-y-5">
          {/* Categoria */}
          <div className="h-4 w-24 bg-zinc-800/60 rounded-full" />
          {/* Nome */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-zinc-800/60 rounded-xl" />
            <div className="h-8 w-1/2 bg-zinc-800/60 rounded-xl" />
          </div>
          {/* Preço */}
          <div className="h-9 w-32 bg-zinc-700/40 rounded-xl" />
          {/* Descrição */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-zinc-800/60 rounded" />
            <div className="h-4 w-full bg-zinc-800/60 rounded" />
            <div className="h-4 w-5/6 bg-zinc-800/60 rounded" />
          </div>
          {/* Cores */}
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-zinc-700/60" />
            ))}
          </div>
          {/* Botão */}
          <div className="h-12 rounded-full bg-brand-700/20 mt-4" />
        </div>
      </div>
    </div>
  )
}
