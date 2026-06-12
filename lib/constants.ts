export const SPEED_STEPS = [0.5, 1, 1.5, 2] as const

export function speedToDelay(speed: number) {
  const delays: Record<number, number> = {
    0.5: 800,
    1: 420,
    1.5: 220,
    2: 90
  }

  return delays[speed] ?? delays[1]
}

export const STEP_COLORS = {
  default: { bg: '#EAF3F6', border: '#91A8B3' },
  comparing: { bg: '#FFE7B8', border: '#F59E0B' },
  swapped: { bg: '#F97316', border: '#EA580C' },
  sorted: { bg: '#14B8A6', border: '#0F766E' },
  pivot: { bg: '#6366F1', border: '#4F46E5' }
}
