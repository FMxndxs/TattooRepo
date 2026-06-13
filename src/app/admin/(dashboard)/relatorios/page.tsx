import { createClient } from '@/lib/supabase/server'
import { ReportsPanel } from '@/components/admin/ReportsPanel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Relatórios — Admin Imagination 3D',
  robots: { index: false, follow: false },
}

// Quantos dias de histórico buscar por padrão
const DEFAULT_DAYS = 30

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const { days: daysParam } = await searchParams
  const days = Math.max(1, Math.min(365, parseInt(daysParam ?? String(DEFAULT_DAYS), 10) || DEFAULT_DAYS))
  const since = new Date(Date.now() - days * 86_400_000).toISOString()

  const supabase = await createClient()

  const [revenueResult, topProductsResult, leadTimesResult, peakHoursResult] = await Promise.all([
    supabase
      .from('v_revenue_daily')
      .select('*')
      .gte('day', since.slice(0, 10))
      .order('day', { ascending: false }),

    supabase
      .from('v_top_products')
      .select('*')
      .limit(20),

    supabase
      .from('v_production_lead_times')
      .select('*')
      .gte('confirmed_at', since)
      .limit(50),

    supabase
      .from('v_peak_hours')
      .select('*'),
  ])

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Faturamento, produtos, lead time e horários de pico.
          </p>
        </div>
        {/* Filtro rápido de período */}
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <a
              key={d}
              href={`/admin/relatorios?days=${d}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                days === d
                  ? 'bg-brand-700 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {d} dias
            </a>
          ))}
        </div>
      </div>

      <ReportsPanel
        days={days}
        revenue={revenueResult.data ?? []}
        topProducts={topProductsResult.data ?? []}
        leadTimes={leadTimesResult.data ?? []}
        peakHours={peakHoursResult.data ?? []}
      />
    </div>
  )
}
