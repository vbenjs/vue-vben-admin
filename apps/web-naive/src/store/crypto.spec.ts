import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCryptoStore } from './crypto'; // Assuming crypto.ts is in the same directory

// Mocking API calls if they were in separate modules:
// vi.mock('#/services/apiClient', () => ({
//   post: vi.fn(),
//   get: vi.fn(),
// }));

describe('useCryptoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with correct default values', () => {
    const store = useCryptoStore();
    expect(store.tokens).toBe(10000); // Default from the store file
    expect(store.portfolio).toBeNull();
    expect(store.apiKeys).toEqual([
      { id: 'binance-mock', exchange: 'Binance', apiKeyMasked: 'AB**...**YZ' },
    ]);
  });

  it('getFormattedTokenBalance returns formatted balance', () => {
    const store = useCryptoStore();
    store.tokens = 12345;
    expect(store.getFormattedTokenBalance()).toBe('12,345');
    store.tokens = 1000;
    expect(store.getFormattedTokenBalance()).toBe('1,000');
  });

  describe('Actions', () => {
    it('fetchTokenBalance updates token balance', async () => {
      const store = useCryptoStore();
      // Mock global Math.random for predictable outcome if store uses it directly
      const mockMath = Object.create(global.Math);
      mockMath.random = () => 0.5; // Will result in 0.5 * 20000 + 5000 = 15000
      global.Math = mockMath;

      await store.fetchTokenBalance();
      expect(store.tokens).toBe(15000);

      global.Math = Object.getPrototypeOf(mockMath); // Restore original Math
    });

    it('generateRecommendation successfully deducts tokens and returns data', async () => {
      const store = useCryptoStore();
      store.tokens = 2000; // Ensure enough tokens
      const payload = { currency: 'BTC', timeframe: '1h', riskAppetite: 'High' };
      const response = await store.generateRecommendation(payload);

      expect(store.tokens).toBe(2000 - 800);
      expect(response).toBeDefined();
      expect(response?.recommendation).toContain('Mock AI Recommendation for BTC');
      expect(response?.orderDetails).toMatchObject({ currency: 'BTC' });
    });

    it('generateRecommendation throws error for insufficient tokens', async () => {
      const store = useCryptoStore();
      store.tokens = 500; // Insufficient tokens
      const payload = { currency: 'ETH', timeframe: '4h', riskAppetite: 'Low' };

      await expect(store.generateRecommendation(payload)).rejects.toThrow('Insufficient tokens');
      expect(store.tokens).toBe(500); // Tokens should not change
    });

    it('fetchPortfolio updates portfolio state', async () => {
      const store = useCryptoStore();
      await store.fetchPortfolio();
      expect(store.portfolio).not.toBeNull();
      expect(store.portfolio?.currentHoldings).toBeInstanceOf(Array);
      expect(store.portfolio?.currentHoldings.length).toBeGreaterThanOrEqual(1); // Based on mock
      expect(store.portfolio?.historicalPositions).toBeInstanceOf(Array);
    });

    it('bindApiKey adds a new API key (masked)', async () => {
      const store = useCryptoStore();
      const initialKeyCount = store.apiKeys.length;
      const payload = { exchange: 'Kraken', apiKey: 'testKey123', apiSecret: 'testSecret' };
      await store.bindApiKey(payload);

      expect(store.apiKeys.length).toBe(initialKeyCount + 1);
      const newKey = store.apiKeys[store.apiKeys.length - 1];
      expect(newKey.exchange).toBe('Kraken');
      expect(newKey.apiKeyMasked).toBe('tes...123'); // Based on store's masking logic
    });

    it('rechargeTokens updates token balance', async () => {
      const store = useCryptoStore();
      store.tokens = 1000;
      // Test 'like' token recharge (assuming it adds to main `tokens` balance)
      await store.rechargeTokens({ tokenType: 'like', amount: 500 });
      expect(store.tokens).toBe(1500);

      // Test 'usdt' token recharge (current mock also adds to main `tokens`)
      await store.rechargeTokens({ tokenType: 'usdt', amount: 300 });
      expect(store.tokens).toBe(1800); // 1500 + 300
    });
  });
});
