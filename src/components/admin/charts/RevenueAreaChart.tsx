'use client'

import { useState } from 'react'
import { buildAreaPath, buildLinePath, niceMax, scaleX, scaleY } from '@/lib/reports/chart'
import { formatBRL } from '@/lib/utils/formatters'

interface RevenueRow {
  day: string
  order_count: number
  revenue: number
  avg_ticket: number
}

interface Props {
  data: RevenueRow[]
}

const W = 600
const H = 160
const PAD = { top: 16, bottom: 28, left: 52, right: 12 }

export function RevenueAreaChart({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; row: RevenueRow } | null>(null)

  if (data.length === 0) {
    return <p className="text-zinc-600 text-sm py-4">Sem dados no período.</p>
  }

  // dados chegam desc, precisamos crescente para o eixo X
  const sorted = [...data].sort((a, b) => a.day.localeCompare(b.day))
  const values = sorted.map((r) => Number(r.revenue))
  const max = niceMax(values)

  const areaPath = buildAreaPath(values, W, H, PAD.left, PAD.right, PAD.top, PAD.bottom)
  const linePath = buildLinePath(values, W, H, PAD.left, PAD.right, PAD.top, PAD.bottom)

  // Rótulos do eixo Y (3 linhas: 0, 50%, max)
  const yLabels = [0, max / 2, max]

  // Rótulos do eixo X (mostrar no máx 6, espaçados uniformemente)
  const xStep = Math.max(1, Math.floor(sorted.length / 6))
  const xLabels = sorted.filter((_, i) => i % xStep === 0 || i === sorted.length - 1)

  function getPoint(i: number) {
    return {
      x: scaleX(i, sorted.length, W, PAD.left, PAD.right),
      y: scaleY(values[i], max, H, PAD.top, PAD.bottom),
    }
  }

  function formatDay(day: string) {
    return new Date(day + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-40"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="rev-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(107,43,168,0.55)" />
            <stop offset="100%" stopColor="rgba(107,43,168,0.03)" />
          </linearGradient>
        </defs>

        {/* Linhas de grade Y */}
        {yLabels.map((v) => {
          const y = scaleY(v, max, H, PAD.top, PAD.bottom)
          return (
            <g key={v}>
              <line
                x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end"
                fontSize="9"
                fill="rgba(255,255,255,0.3)"
              >
                {v === 0 ? '0' : formatBRL(v).replace('R$ ', '').replace('R$ ', '')}
              </text>
            </g>
          )
        })}

        {/* Rótulos eixo X */}
        {xLabels.map((row) => {
          const i = sorted.indexOf(row)
          const x = scaleX(i, sorted.length, W, PAD.left, PAD.right)
          return (
            <text
              key={row.day}
              x={x} y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(255,255,255,0.3)"
            >
              {formatDay(row.day)}
            </text>
          )
        })}

        {/* Área preenchida */}
        {areaPath && (
          <path d={areaPath} fill="url(#rev-area-grad)" />
        )}

        {/* Linha */}
        {linePath && (
          <path d={linePath} fill="none" stroke="rgb(107,43,168)" strokeWidth="2" strokeLinejoin="round" />
        )}

        {/* Pontos interativos (hover) */}
        {sorted.map((row, i) => {
          const { x, y } = getPoint(i)
          return (
            <circle
              key={row.day}
              cx={x} cy={y} r="14"
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={(e) => {
                const rect = (e.currentTarget.closest('svg') as SVGSVGElement).getBoundingClientRect()
                setTooltip({
                  x: ((x / W) * rect.width) + rect.left,
                  y: rect.top - 8,
                  row,
                })
              }}
            />
          )
        })}

        {/* Dot de destaque no hover */}
        {tooltip && (() => {
          const i = sorted.findIndex((r) => r.day === tooltip.row.day)
          const { x, y } = getPoint(i)
          return (
            <circle cx={x} cy={y} r="4" fill="rgb(182,131,255)" stroke="rgb(67,19,112)" strokeWidth="2" />
          )
        })()}
      </svg>

      {/* Tooltip flutuante */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-zinc-400 mb-1">
            {new Date(tooltip.row.day + 'T12:00:00').toLocaleDateString('pt-BR')}
          </p>
          <p className="text-brand-300 font-semibold">{formatBRL(tooltip.row.revenue)}</p>
          <p className="text-zinc-400">{tooltip.row.order_count} pedido{tooltip.row.order_count !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}
