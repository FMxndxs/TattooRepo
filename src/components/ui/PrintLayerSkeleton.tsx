'use client'

/**
 * Skeleton inspirado em camadas successivas da impressão FDM —
 * uso em grids de produto sem sobrecarregar com spinners genéricos.
 */
export function PrintLayerSkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
      aria-hidden
    >
      <div className="aspect-square relative bg-zinc-950/70 overflow-hidden print-skel-area">
        <div className="absolute inset-x-3 top-3 h-[2px] rounded-full bg-brand-400/35 print-skel-hotline" />
        <div className="absolute inset-0 print-skel-layers" />
      </div>
      <div className="p-4 space-y-2.5 border-t border-zinc-800/80">
        <div className="h-4 bg-zinc-800 rounded-lg print-extrusion-shimmer w-[88%]" />
        <div className="h-3 bg-zinc-800/70 rounded-lg print-extrusion-shimmer w-[55%] delay-[120ms]" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-16 bg-brand-900/80 rounded-lg print-extrusion-shimmer opacity-70" />
          <div className="h-5 w-20 bg-zinc-800 rounded-full opacity-70" />
        </div>
      </div>
    </div>
  )
}

interface PrintLayerSkeletonGridProps {
  count?: number
}

export function PrintLayerSkeletonGrid({ count = 8 }: PrintLayerSkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PrintLayerSkeletonCard key={i} />
      ))}
    </div>
  )
}
