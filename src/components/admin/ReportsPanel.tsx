'use client'

import { Download, Printer } from 'lucide-react'
import { formatBRL } from '@/lib/utils/formatters'
import { RevenueAreaChart } from './charts/RevenueAreaChart'
import { TopProductsBarChart } from './charts/TopProductsBarChart'
import { PeakHoursChart } from './charts/PeakHoursChart'
import { LayerReveal } from '@/components/ui/MotionPrimitives'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RevenueRow {
  day: string
  order_count: number
  revenue: number
  avg_ticket: number
}

interface TopProductRow {
  product_name: string
  color_name: string | null
  order_count: number
  total_qty: number
  total_revenue: number
}

interface LeadTimeRow {
  order_id: string
  order_code: string | null
  customer_name: string
  total: number
  confirmed_at: string
  ready_at: string | null
  lead_minutes: number | null
}

interface PeakHourRow {
  hour_of_day: number
  order_count: number
}

interface ReportsPanelProps {
  days: number
  revenue: RevenueRow[]
  topProducts: TopProductRow[]
  leadTimes: LeadTimeRow[]
  peakHours: PeakHourRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function totalRevenue(rows: RevenueRow[]) {
  return rows.reduce((s, r) => s + Number(r.revenue ?? 0), 0)
}

function totalOrders(rows: RevenueRow[]) {
  return rows.reduce((s, r) => s + (r.order_count ?? 0), 0)
}

function avgTicket(rows: RevenueRow[]) {
  const orders = totalOrders(rows)
  return orders > 0 ? totalRevenue(rows) / orders : 0
}

function avgLeadTime(rows: LeadTimeRow[]) {
  const valid = rows.filter((r) => r.lead_minutes != null)
  if (!valid.length) return null
  return Math.round(valid.reduce((s, r) => s + (r.lead_minutes ?? 0), 0) / valid.length)
}

function formatMinutes(min: number | null): string {
  if (min == null) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function downloadCsv(headers: string[], rows: string[][], filename: string) {
  const lines = [headers.join(';'), ...rows.map((r) => r.join(';'))]
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ReportsPanel({ days, revenue, topProducts, leadTimes, peakHours }: ReportsPanelProps) {
  const total = totalRevenue(revenue)
  const orders = totalOrders(revenue)
  const ticket = avgTicket(revenue)
  const leadAvg = avgLeadTime(leadTimes)

  function handlePrint() { window.print() }

  function handleCsvRevenue() {
    downloadCsv(
      ['Data', 'Pedidos', 'Faturamento (R$)', 'Ticket Médio (R$)'],
      revenue.map((r) => [
        r.day,
        String(r.order_count),
        Number(r.revenue).toFixed(2).replace('.', ','),
        Number(r.avg_ticket).toFixed(2).replace('.', ','),
      ]),
      `faturamento-${days}d.csv`,
    )
  }

  function handleCsvProducts() {
    downloadCsv(
      ['Produto', 'Cor', 'Pedidos', 'Quantidade', 'Receita (R$)'],
      topProducts.map((r) => [
        r.product_name,
        r.color_name ?? '—',
        String(r.order_count),
        String(r.total_qty),
        Number(r.total_revenue).toFixed(2).replace('.', ','),
      ]),
      `produtos-top-${days}d.csv`,
    )
  }

  return (
    <div className="space-y-8 reports-content">

      {/* Ações globais */}
      <div className="no-print flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>
        <button
          type="button"
          onClick={handleCsvRevenue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV Faturamento
        </button>
        <button
          type="button"
          onClick={handleCsvProducts}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV Produtos
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <LayerReveal>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: `Faturamento (${days}d)`, value: formatBRL(total), highlight: true },
            { label: 'Pedidos', value: String(orders) },
            { label: 'Ticket médio', value: formatBRL(ticket) },
            { label: 'Lead time médio', value: formatMinutes(leadAvg) },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <p className="text-zinc-500 text-xs mb-1">{label}</p>
              <p className={`font-bold text-2xl ${highlight ? 'text-brand-300' : 'text-white'}`}>
                {value}
              </p>
            </div>
          ))}
        </section>
      </LayerReveal>

      {/* ── Gráfico de faturamento ─────────────────────────────────────── */}
      <LayerReveal delay={0.05}>
        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-white font-semibold mb-4">Faturamento diário</h2>
          <RevenueAreaChart data={revenue} />
        </section>
      </LayerReveal>

      {/* ── Top produtos — gráfico + tabela ───────────────────────────── */}
      <LayerReveal delay={0.1}>
        <section>
          <h2 className="text-white font-semibold mb-4">Produtos mais vendidos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Gráfico de barras */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <TopProductsBarChart data={topProducts} />
            </div>
            {/* Tabela de detalhes */}
            {topProducts.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-3">Produto</th>
                      <th className="text-right px-4 py-3">Qtd.</th>
                      <th className="text-right px-4 py-3">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 last:border-0">
                        <td className="px-4 py-2.5 text-zinc-200 text-xs">
                          <span className="block font-medium truncate max-w-[160px]">{row.product_name}</span>
                          {row.color_name && <span className="text-zinc-500">{row.color_name}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right text-zinc-300 text-xs">{row.total_qty}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-brand-300 text-xs">
                          {formatBRL(row.total_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </LayerReveal>

      {/* ── Horários de pico ──────────────────────────────────────────── */}
      <LayerReveal delay={0.15}>
        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-white font-semibold mb-4">Horários de pico</h2>
          <PeakHoursChart data={peakHours} />
        </section>
      </LayerReveal>

      {/* ── Lead times ────────────────────────────────────────────────── */}
      {leadTimes.length > 0 && (
        <LayerReveal delay={0.2}>
          <section>
            <h2 className="text-white font-semibold mb-4">
              Lead time de produção (últimos {leadTimes.length})
            </h2>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Pedido</th>
                    <th className="text-left px-5 py-3">Cliente</th>
                    <th className="text-right px-5 py-3">Total</th>
                    <th className="text-right px-5 py-3">Lead time</th>
                  </tr>
                </thead>
                <tbody>
                  {leadTimes.map((row) => (
                    <tr key={row.order_id} className="border-b border-zinc-800/50 last:border-0">
                      <td className="px-5 py-3 font-mono text-xs text-brand-300">
                        {row.order_code ? `#${row.order_code}` : '—'}
                      </td>
                      <td className="px-5 py-3 text-zinc-300">{row.customer_name}</td>
                      <td className="px-5 py-3 text-right text-zinc-300">{formatBRL(row.total)}</td>
                      <td className="px-5 py-3 text-right font-semibold text-zinc-200">
                        {formatMinutes(row.lead_minutes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </LayerReveal>
      )}

      {/* ── Tabela de faturamento diário (detalhamento) ────────────────── */}
      {revenue.length > 0 && (
        <LayerReveal delay={0.25}>
          <section>
            <h2 className="text-white font-semibold mb-4">Faturamento — detalhe por dia</h2>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Data</th>
                    <th className="text-right px-5 py-3">Pedidos</th>
                    <th className="text-right px-5 py-3">Faturamento</th>
                    <th className="text-right px-5 py-3">Ticket médio</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.map((row) => (
                    <tr key={row.day} className="border-b border-zinc-800/50 last:border-0">
                      <td className="px-5 py-3 text-zinc-300">
                        {new Date(row.day + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-300">{row.order_count}</td>
                      <td className="px-5 py-3 text-right font-semibold text-brand-300">
                        {formatBRL(row.revenue)}
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-400">
                        {formatBRL(row.avg_ticket)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </LayerReveal>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: #000 !important; }
          .reports-content { color: #000 !important; }
          table { border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 4px 8px; }
        }
      `}</style>
    </div>
  )
}
