'use client'

import { useState } from 'react'

interface PeakHourRow {
  hour_of_day: number
  order_count: number
}

interface Props {
  data: PeakHourRow[]
}

export function PeakHoursChart({ data }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (data.length === 0) {
    return <p className="text-zinc-600 text-sm py-4">Sem dados no período.</p>
  }

  const maxCount = Math.max(...data.map((r) => r.order_count), 1)

  return (
    <div>
      <div className="flex items-end gap-[3px] h-28">
        {Array.from({ length: 24 }, (_, h) => {
          const row = data.find((r) => r.hour_of_day === h)
          const count = row?.order_count ?? 0
          const pct = count > 0 ? Math.max((count / maxCount) * 100, 6) : 0
          const isHovered = hovered === h
          const isPeak = count === maxCount && count > 0

          return (
            <div
              key={h}
              className="flex-1 flex flex-col items-center gap-1 cursor-default"
              onMouseEnter={() => setHovered(h)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* tooltip acima */}
              <div className={`text-[9px] font-semibold text-brand-300 transition-opacity ${isHovered && count > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {count}
              </div>
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t transition-colors duration-150 ${
                    isPeak
                      ? 'bg-brand-300/80'
                      : isHovered
                      ? 'bg-brand-500/80'
                      : 'bg-brand-700/60'
                  }`}
                  style={{ height: count > 0 ? `${pct}%` : '2px', opacity: count > 0 ? 1 : 0.2 }}
                />
              </div>
              {h % 4 === 0 && (
                <span className="text-zinc-600 text-[9px] leading-none">{h}h</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legenda: hora de pico */}
      {maxCount > 0 && (() => {
        const peakRow = data.reduce((a, b) => a.order_count >= b.order_count ? a : b)
        return (
          <p className="text-zinc-500 text-xs mt-3">
            Pico às <span className="text-white font-medium">{peakRow.hour_of_day}h</span> — {peakRow.order_count} pedido{peakRow.order_count !== 1 ? 's' : ''}
          </p>
        )
      })()}
    </div>
  )
}
