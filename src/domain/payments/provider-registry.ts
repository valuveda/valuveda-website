import type { PaymentProviderAdapter } from './provider-contract';

export class PaymentProviderRegistry {
  private readonly adapters = new Map<string, PaymentProviderAdapter>();

  register(adapter: PaymentProviderAdapter): void {
    this.adapters.set(adapter.code, adapter);
  }

  get(code: string): PaymentProviderAdapter {
    const adapter = this.adapters.get(code);
    if (!adapter) throw new Error(`Payment provider is not registered: ${code}`);
    return adapter;
  }
}
