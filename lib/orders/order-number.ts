import { randomInt } from 'node:crypto'

/**
 * Human-friendly identifier. Database uniqueness is still the final authority;
 * callers should retry on the rare unique-constraint collision.
 */
export function createOrderNumber(now = new Date()): string {
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  const d = String(now.getUTCDate()).padStart(2, '0')
  const suffix = randomInt(0, 1_000_000).toString().padStart(6, '0')
  return `VV-${y}${m}${d}-${suffix}`
}
