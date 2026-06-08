import { NextRequest, NextResponse } from 'next/server'
import { geocodeCep } from '@/lib/geocoding/cep'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const rawCep = searchParams.get('cep') ?? ''

  const cep = rawCep.replace(/\D/g, '')
  if (cep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido — informe 8 dígitos' }, { status: 400 })
  }

  const geo = await geocodeCep(cep)

  if (!geo) {
    return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 })
  }

  return NextResponse.json(geo)
}
