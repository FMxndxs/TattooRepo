const FILAMENT_COST_PER_GRAM = 0.15
const MACHINE_COST_PER_HOUR = 5

interface PriceInput {
  filamentGrams: number
  printTimeMinutes: number
  marginPercent?: number
}

export function calculatePrice({ filamentGrams, printTimeMinutes, marginPercent = 0 }: PriceInput): number {
  const filamentCost = filamentGrams * FILAMENT_COST_PER_GRAM
  const machineCost = (printTimeMinutes / 60) * MACHINE_COST_PER_HOUR
  const cost = filamentCost + machineCost
  return cost * (1 + marginPercent / 100)
}

export function formatPrintTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}
