import type { ShippingProvider } from './shipping'

export type ShippingProviderCode = string

const providers = new Map<string, ShippingProvider>()

export function registerShippingProvider(provider: ShippingProvider) {
  const code = provider.code.trim().toLowerCase()
  if (!code) throw new Error('Shipping provider code is required')
  providers.set(code, provider)
}

export function getShippingProvider(code: ShippingProviderCode) {
  const normalized = code.trim().toLowerCase()
  const provider = providers.get(normalized)
  if (!provider) throw new Error(`Shipping provider "${normalized}" is not configured`)
  return provider
}

export function listShippingProviders() {
  return [...providers.values()].map((provider) => provider.code)
}
