import type { ShippingProviderAdapter } from './provider-contract';

export class ShippingProviderRegistry {
  private readonly adapters = new Map<string, ShippingProviderAdapter>();

  register(adapter: ShippingProviderAdapter): void {
    this.adapters.set(adapter.code, adapter);
  }

  get(code: string): ShippingProviderAdapter {
    const adapter = this.adapters.get(code);
    if (!adapter) throw new Error(`Shipping provider is not registered: ${code}`);
    return adapter;
  }
}
