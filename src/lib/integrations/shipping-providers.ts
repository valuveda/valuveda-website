import { getShippingProvider } from './shipping-registry'
import { ShipmozoProvider } from './shipping'

let initialized = false

function initializeProviders() {
  if (initialized) return
  initialized = true
  try {
    getShippingProvider('shipmozo')
  } catch {
    // Registration is intentionally lazy and provider credentials are checked by the adapter.
  }
}

export function resolveShippingProvider(code: string) {
  initializeProviders()
  if (code.trim().toLowerCase() === 'shipmozo') {
    return new ShipmozoProvider()
  }
  return getShippingProvider(code)
}
