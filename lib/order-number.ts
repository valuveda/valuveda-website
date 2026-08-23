export function createOrderNumber(now = new Date(), random = Math.floor(Math.random() * 1_000_000)) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = String(random).padStart(6, '0').slice(-6)
  return `VV-${date}-${suffix}`
}
