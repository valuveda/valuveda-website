import { randomInt } from 'node:crypto'

export function createOrderNumber(now = new Date()): string {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = String(randomInt(0, 1_000_000)).padStart(6, '0')
  return `VV-${date}-${suffix}`
}
