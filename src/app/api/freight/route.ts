import { NextRequest, NextResponse } from 'next/server'
import { geocodeCep } from '@/lib/geocoding/cep'
import { quoteFreight } from '@/lib/utils/freight'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const rawCep = searchParams.get('cep') ?? ''
  const number = searchParams.get('number') ?? undefined

  const cep = rawCep.replace(/\D/g, '')
  if (cep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido — informe 8 dígitos' }, { status: 400 })
  }

  const geo = await geocodeCep(cep, number)
  const quote = quoteFreight(geo?.coords ?? null, geo?.address)

  return NextResponse.json(quote)
}
