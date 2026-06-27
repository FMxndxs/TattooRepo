import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkApiKey, REPORT_DATASETS, type ReportDataset } from '@/lib/reports/auth'
import { checkRateLimit, extractIp } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 30 requisições por minuto por IP (defesa-em-profundidade além da autenticação)
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000

// ─── Extrai a candidate key do request ───────────────────────────────────────
// Aceita somente Authorization: Bearer — não via ?key= (ficaria em logs/histórico)

function extractCandidate(req: NextRequest): string {
  const authHeader = req.headers.get('authorization') ?? ''
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7)
  return ''
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  // 0. Rate limiting por IP
  const ip = extractIp(req.headers)
  const rl = checkRateLimit(`reports:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em alguns instantes.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfter ?? 60) },
      },
    )
  }

  // 1. Verificar configuração do servidor
  if (!process.env.REPORTS_API_KEY) {
    return NextResponse.json(
      { error: 'Endpoint não configurado — REPORTS_API_KEY ausente no servidor.' },
      { status: 500 },
    )
  }

  // 2. Autenticação
  if (!checkApiKey(extractCandidate(req), process.env.REPORTS_API_KEY)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // 3. Parâmetros opcionais
  const { searchParams } = req.nextUrl
  const datasetParam = searchParams.get('dataset')
  const daysParam = searchParams.get('days')
  const days = daysParam ? Math.min(Math.max(parseInt(daysParam, 10) || 30, 1), 365) : null

  const since = days
    ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    : null

  // 4. Validar dataset específico (quando informado)
  if (datasetParam && !(REPORT_DATASETS as readonly string[]).includes(datasetParam)) {
    return NextResponse.json(
      { error: `Dataset inválido. Valores aceitos: ${REPORT_DATASETS.join(', ')}.` },
      { status: 400 },
    )
  }

  try {
    const supabase = createAdminClient()

    // ── Queries ──────────────────────────────────────────────────────────────
    const revenueQuery = supabase
      .from('v_revenue_daily')
      .select('*')
      .order('day', { ascending: false })
    if (since) revenueQuery.gte('day', since)

    const topProductsQuery = supabase.from('v_top_products').select('*')

    const leadTimesQuery = supabase
      .from('v_production_lead_times')
      .select('*')
      .order('confirmed_at', { ascending: false })
    if (since) leadTimesQuery.gte('confirmed_at', since)

    const peakHoursQuery = supabase
      .from('v_peak_hours')
      .select('*')
      .order('hour_of_day', { ascending: true })

    // ── Retorno por dataset específico ────────────────────────────────────────
    if (datasetParam) {
      const queryMap: Record<ReportDataset, typeof revenueQuery> = {
        revenue_daily: revenueQuery,
        top_products: topProductsQuery,
        lead_times: leadTimesQuery,
        peak_hours: peakHoursQuery,
      }
      const { data, error } = await queryMap[datasetParam as ReportDataset]
      if (error) throw error
      return NextResponse.json(data ?? [], {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // ── Retorno completo (todos os datasets) ──────────────────────────────────
    const [revenue, topProducts, leadTimes, peakHours] = await Promise.all([
      revenueQuery,
      topProductsQuery,
      leadTimesQuery,
      peakHoursQuery,
    ])

    for (const result of [revenue, topProducts, leadTimes, peakHours]) {
      if (result.error) throw result.error
    }

    return NextResponse.json(
      {
        revenue_daily: revenue.data ?? [],
        top_products: topProducts.data ?? [],
        lead_times: leadTimes.data ?? [],
        peak_hours: peakHours.data ?? [],
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[/api/reports] Erro ao buscar dados:', err)
    return NextResponse.json({ error: 'Erro interno ao buscar relatório.' }, { status: 500 })
  }
}
