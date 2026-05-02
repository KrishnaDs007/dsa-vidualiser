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
  default: { bg: '#F1EFE8', border: '#B4B2A9' },
  comparing: { bg: '#FAEEDA', border: '#BA7517' },
  swapped: { bg: '#BA7517', border: '#BA7517' },
  sorted: { bg: '#1D9E75', border: '#1D9E75' },
  pivot: { bg: '#534AB7', border: '#534AB7' }
}
