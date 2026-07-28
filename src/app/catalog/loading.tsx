import { PrintLayerSkeletonGrid } from '@/components/ui/PrintLayerSkeleton'

/**
 * catalog/loading.tsx — skeleton de grade de produtos enquanto o catálogo carrega.
 * Reaproveita PrintLayerSkeletonGrid para consistência visual com o tema 3D.
 */
export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Barra de filtros (placeholder) */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 h-9 w-24 rounded-full bg-zinc-800/60 animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>

      <PrintLayerSkeletonGrid />
    </div>
  )
}
