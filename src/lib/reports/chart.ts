/**
 * Utilitários puros para os gráficos SVG do dashboard de relatórios.
 * Sem dependências externas — testáveis diretamente.
 */

/** Arredonda para cima para um valor "nice" (múltiplo de 5, 10, 25, 50, 100…) */
export function niceMax(values: number[]): number {
  if (!values.length) return 100
  const raw = Math.max(...values)
  if (raw <= 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)))
  const steps = [1, 2, 2.5, 5, 10]
  for (const s of steps) {
    const candidate = Math.ceil(raw / (magnitude * s)) * magnitude * s
    if (candidate >= raw) return candidate
  }
  return Math.ceil(raw / magnitude) * magnitude
}

/** Converte um valor para coordenada Y dentro do SVG (Y cresce para baixo). */
export function scaleY(value: number, max: number, height: number, padTop: number, padBottom: number): number {
  const drawH = height - padTop - padBottom
  return padTop + drawH - (value / max) * drawH
}

/** Converte um índice para coordenada X dentro do SVG. */
export function scaleX(index: number, total: number, width: number, padLeft: number, padRight: number): number {
  if (total <= 1) return padLeft
  const drawW = width - padLeft - padRight
  return padLeft + (index / (total - 1)) * drawW
}

/** Gera o atributo `d` de um <path> de linha (polyline). Retorna '' se < 2 pontos. */
export function buildLinePath(
  values: number[],
  width: number,
  height: number,
  padLeft = 0,
  padRight = 0,
  padTop = 0,
  padBottom = 0,
): string {
  if (values.length < 2) return ''
  const max = niceMax(values)
  return values
    .map((v, i) => {
      const x = scaleX(i, values.length, width, padLeft, padRight)
      const y = scaleY(v, max, height, padTop, padBottom)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

/** Gera o atributo `d` de um <path> de área (linha + fechamento na base). */
export function buildAreaPath(
  values: number[],
  width: number,
  height: number,
  padLeft = 0,
  padRight = 0,
  padTop = 0,
  padBottom = 0,
): string {
  if (values.length < 2) return ''
  const linePart = buildLinePath(values, width, height, padLeft, padRight, padTop, padBottom)
  const lastX = scaleX(values.length - 1, values.length, width, padLeft, padRight)
  const firstX = scaleX(0, values.length, width, padLeft, padRight)
  const baseY = height - padBottom
  return `${linePart} L${lastX.toFixed(2)},${baseY.toFixed(2)} L${firstX.toFixed(2)},${baseY.toFixed(2)} Z`
}
