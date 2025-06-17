import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define interfaces for complex types for better type safety
interface Holding {
  asset: string;
  amount: number;
  currentValue: number;
  purchasePrice: number;
}

interface Position {
  asset: string;
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  timestamp: string;
  status: 'OPEN' | 'CLOSED';
}

interface PortfolioData {
  currentHoldings: Array<Holding>;
  historicalPositions: Array<Position>;
}

interface ApiKeyEntry {
  id: string; // For UI key management
  exchange: string;
  apiKeyMasked: string; // Store only masked key or identifier
  // Avoid storing raw apiSecret in the store for security reasons
}

interface RecommendationRequest {
  currency: string;
  timeframe: string;
  riskAppetite: string;
}

interface RecommendationResponse {
  recommendation: string;
  orderDetails: object;
}

interface ApiKeyBindRequest {
  exchange: string;
  apiKey: string;
  apiSecret: string;
}

interface RechargeRequest {
  tokenType: 'like' | 'usdt';
  amount: number;
}

export const useCryptoStore = defineStore('crypto', () => {
  // --- STATE ---
  const tokens = ref<number>(10000); // Initial mock token balance
  const portfolio = ref<PortfolioData | null>(null);
  const apiKeys = ref<Array<ApiKeyEntry>>([
    // Mock initial API key
    { id: 'binance-mock', exchange: 'Binance', apiKeyMasked: 'AB**...**YZ' },
  ]);

  // --- GETTERS --- (Example)
  const getFormattedTokenBalance = (): string => {
    return tokens.value.toLocaleString();
  };

  // --- ACTIONS ---

  async function fetchTokenBalance() {
    console.log('[CryptoStore] fetchTokenBalance called');
    try {
      // Simulate API call to fetch token balance
      await new Promise(resolve => setTimeout(resolve, 300)); // Mock delay
      const fetchedBalance = Math.floor(Math.random() * 20000) + 5000; // Simulate fetching a new balance
      tokens.value = fetchedBalance;
      console.log('[CryptoStore] Token balance updated:', tokens.value);
    } catch (error) {
      console.error('[CryptoStore] Error fetching token balance:', error);
      // In a real app, you might want to show a notification to the user
    }
  }

  async function generateRecommendation(payload: RecommendationRequest): Promise<RecommendationResponse | undefined> {
    console.log('[CryptoStore] generateRecommendation called with:', payload);
    try {
      // Simulate API call to /api/crypto/recommendations
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay

      const tokenCost = 800;
      if (tokens.value < tokenCost) {
        console.warn('[CryptoStore] Insufficient tokens for recommendation.');
        throw new Error('Insufficient tokens');
      }

      // Simulate successful response
      const mockResponse: RecommendationResponse = {
        recommendation: `Mock AI Recommendation for ${payload.currency} (${payload.timeframe}, ${payload.riskAppetite}).`,
        orderDetails: {
          action: 'BUY',
          currency: payload.currency,
          quantity: Math.random() * 10,
          price: Math.random() * 50000,
        },
      };
      tokens.value -= tokenCost; // Deduct tokens
      console.log('[CryptoStore] Recommendation generated. Tokens updated:', tokens.value);
      return mockResponse;
    } catch (error) {
      console.error('[CryptoStore] Error generating recommendation:', error);
      // Propagate error or handle it (e.g., show notification)
      throw error;
    }
  }

  async function fetchPortfolio() {
    console.log('[CryptoStore] fetchPortfolio called');
    try {
      // Simulate API call to /api/crypto/portfolio
      await new Promise(resolve => setTimeout(resolve, 800)); // Mock API delay
      const mockPortfolioData: PortfolioData = {
        currentHoldings: [
          { asset: 'Bitcoin (BTC)', amount: 1.5, currentValue: 75000, purchasePrice: 40000 },
          { asset: 'Ethereum (ETH)', amount: 20, currentValue: 60000, purchasePrice: 2000 },
        ],
        historicalPositions: [
          { asset: 'Solana (SOL)', entryPrice: 90, exitPrice: 110, amount: 50, timestamp: '2023-11-01', status: 'CLOSED' },
        ],
      };
      portfolio.value = mockPortfolioData;
      console.log('[CryptoStore] Portfolio data fetched:', portfolio.value);
    } catch (error) {
      console.error('[CryptoStore] Error fetching portfolio:', error);
    }
  }

  async function bindApiKey(payload: ApiKeyBindRequest) {
    console.log('[CryptoStore] bindApiKey called with:', { ...payload, apiSecret: '***MASKED***' });
    try {
      // Simulate API call to /api/crypto/apikeys
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock API delay

      // Simulate successful response - in a real app, the backend would confirm success
      const newKeyEntry: ApiKeyEntry = {
        id: `${payload.exchange.toLowerCase()}-${Date.now()}`,
        exchange: payload.exchange,
        apiKeyMasked: `${payload.apiKey.substring(0, 3)}...${payload.apiKey.slice(-3)}`,
      };
      apiKeys.value.push(newKeyEntry);
      console.log('[CryptoStore] API Key bound. Current keys:', apiKeys.value);
    } catch (error) {
      console.error('[CryptoStore] Error binding API key:', error);
      throw error;
    }
  }

  async function rechargeTokens(payload: RechargeRequest) {
    console.log('[CryptoStore] rechargeTokens called with:', payload);
    try {
      // Simulate API call to /api/crypto/recharge
      await new Promise(resolve => setTimeout(resolve, 700)); // Mock API delay

      // Simulate successful response
      // For now, assuming 'like' tokens are the main balance reflected in `tokens.value`
      // A more complex store might have separate balances for 'like' and 'usdt'
      if (payload.tokenType === 'like') {
        tokens.value += payload.amount;
      } else if (payload.tokenType === 'usdt') {
        // If you have a separate USDT balance, update it here.
        // For this example, let's assume USDT recharges also affect the general 'tokens' for simplicity,
        // or you might convert/ignore them for the primary 'tokens' state.
        // tokens.value += payload.amount; // Or handle USDT separately
        console.log(`[CryptoStore] ${payload.amount} USDT recharged. Not directly adding to primary 'tokens' balance in this mock.`);
      }
      // Let's assume the primary `tokens.value` is for "like" tokens or a general service credit.
      // The backend recharge.post.ts handles specific balances; this store's `tokens` is simplified for now.
      // To reflect the recharge for 'like' tokens:
      // if (payload.tokenType === 'like') { tokens.value += payload.amount; }
      // For this mock, let's just add any amount to the main `tokens` state for demo purposes.
      tokens.value += payload.amount;


      console.log('[CryptoStore] Tokens recharged. New balance:', tokens.value);
      // In a real scenario, you'd likely call fetchTokenBalance() or the backend would return the new balance.
    } catch (error) {
      console.error('[CryptoStore] Error recharging tokens:', error);
      throw error;
    }
  }

  return {
    // State
    tokens,
    portfolio,
    apiKeys,
    // Getters
    getFormattedTokenBalance,
    // Actions
    fetchTokenBalance,
    generateRecommendation,
    fetchPortfolio,
    bindApiKey,
    rechargeTokens,
  };
});
