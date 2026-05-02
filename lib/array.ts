import { clamp } from '@/lib/utils'

export const DEFAULT_ARRAY = [42, 18, 67, 29, 91, 54, 36, 73]

export function parseArrayParam(value?: string) {
  if (!value) return DEFAULT_ARRAY

  const parsed = value
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item))
    .map((item) => clamp(item, 5, 99))
    .slice(0, 32)

  return parsed.length >= 2 ? parsed : DEFAULT_ARRAY
}

export function parseArrayInput(value: string) {
  return parseArrayParam(value)
}

export function generateRandomArray(size = 10) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 86) + 10)
}
