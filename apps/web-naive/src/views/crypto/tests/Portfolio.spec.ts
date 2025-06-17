import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Portfolio from '../Portfolio.vue'; // Adjust path as necessary
import { useCryptoStore } from '#/store/crypto'; // Adjust path to your store

// Mock Naive UI components
vi.mock('naive-ui', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    NCard: { template: '<div><slot></slot></div>' },
    NSpace: { template: '<div><slot></slot></div>' },
    NH2: { template: '<h2><slot></slot></h2>' },
    NDataTable: { props: ['columns', 'data'], template: '<table><tbody><tr v-for="row in data"><td v-for="col in columns">{{ col.title }}: {{ row[col.key] }}</td></tr></tbody></table>' }, // Simplified mock
    NDivider: { template: '<hr/>' },
    NTag: { template: '<span><slot></slot></span>' }, // Basic mock for NTag
  };
});

describe('Portfolio.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it('renders section titles and tables', () => {
    const wrapper = mount(Portfolio, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.find('h2').text()).toBe('Current Holdings');
    expect(wrapper.findAll('h2')[1].text()).toBe('Historical Positions');
    expect(wrapper.findAll('table').length).toBe(2); // One for holdings, one for positions
  });

  it('displays data from store in holdings and positions tables', async () => {
    const store = useCryptoStore();
    const mockPortfolioData = {
      currentHoldings: [
        { id: 'btc', asset: 'Bitcoin (BTC)', amount: 2.5, currentPrice: 50000, totalValue: 125000, purchasePrice: 45000 },
        { id: 'eth', asset: 'Ethereum (ETH)', amount: 10, currentPrice: 3000, totalValue: 30000, purchasePrice: 2500 },
      ],
      historicalPositions: [
        { id: 'sol-closed', asset: 'Solana (SOL)', entryPrice: 80, exitPrice: 120, amount: 100, timestamp: '2023-10-15T10:00:00Z', status: 'CLOSED', pnl: 4000 },
      ],
    };
    // Manually set store state for this test
    store.portfolio = mockPortfolioData;

    const wrapper = mount(Portfolio, {
      global: {
        plugins: [pinia],
      },
    });

    await wrapper.vm.$nextTick(); // Wait for Vue to react to store changes if any were async (not in this direct setup)

    // Check current holdings table (based on simplified NDataTable mock)
    const tables = wrapper.findAll('table');
    const holdingsTableRows = tables[0].findAll('tr');
    expect(holdingsTableRows.length).toBe(mockPortfolioData.currentHoldings.length);
    // Example check for first row data - this depends heavily on NDataTable mock structure
    // The mock renders: "Title: Value" for each cell.
    expect(holdingsTableRows[0].text()).toContain('Asset: Bitcoin (BTC)');
    expect(holdingsTableRows[0].text()).toContain('Amount: 2.5');

    // Check historical positions table
    const positionsTableRows = tables[1].findAll('tr');
    expect(positionsTableRows.length).toBe(mockPortfolioData.historicalPositions.length);
    expect(positionsTableRows[0].text()).toContain('Asset: Solana (SOL)');
    expect(positionsTableRows[0].text()).toContain('Status: CLOSED');
  });

  it('calls fetchPortfolio action on created (or handles data absence)', async () => {
    const store = useCryptoStore();
    const fetchPortfolioSpy = vi.spyOn(store, 'fetchPortfolio');
    // In the current Portfolio.vue, data is directly used from `currentHoldings` and `historicalPositions` refs,
    // which are initialized with static data. It does not call fetchPortfolio itself.
    // If the component were to call fetchPortfolio, e.g., in onMounted, this test would be relevant.
    // For now, we test if it renders the initial static data.

    // To make this test meaningful for action calling, we would modify Portfolio.vue to call fetchPortfolio.
    // e.g. in setup():
    // onMounted(async () => {
    //   if (!store.portfolio) { // Or always refresh
    //     await store.fetchPortfolio();
    //   }
    // });
    // If such a change were made, the spy would be checked.

    // For the component as it is (using static initial refs):
    mount(Portfolio, {
      global: {
        plugins: [pinia],
      },
    });
    // If it were to call on mount:
    // expect(fetchPortfolioSpy).toHaveBeenCalledTimes(1);
    // Since it doesn't, this spy won't be called unless we trigger it or change component.
    // This highlights that the component currently uses its own default mock data, not directly from store.portfolio initially.
    // The component's `currentHoldings` and `historicalPositions` are local refs, not directly from store.portfolio.
    // This test should be adapted if the component's logic changes to fetch from store.

    // Let's verify it renders its own initial data if store.portfolio is null
    store.portfolio = null; // Ensure store portfolio is empty
    const wrapper = mount(Portfolio, {
        global: {
            plugins: [pinia],
        },
    });
    const tables = wrapper.findAll('table');
    // The component's internal refs `currentHoldings` and `historicalPositions` are initialized with data.
    expect(tables[0].findAll('tr').length).toBeGreaterThan(0);
    expect(tables[1].findAll('tr').length).toBeGreaterThan(0);
    expect(fetchPortfolioSpy).not.toHaveBeenCalled(); // fetchPortfolio is not called by the current component
  });

  it('renders empty state messages if data arrays are empty (if component supported this)', () => {
    // This test would apply if the component had logic to show NEmpty or similar
    // when currentHoldings or historicalPositions were empty.
    // The current component's refs are initialized with data, so this state isn't hit by default.
    // To test, we'd have to manually clear the component's internal refs.
    const wrapper = mount(Portfolio, {
      global: {
        plugins: [pinia],
      },
    });
    // Manually clear the component's data to test empty state (if it had one)
    wrapper.vm.currentHoldings = [];
    wrapper.vm.historicalPositions = [];
    // await wrapper.vm.$nextTick();
    // expect(wrapper.text()).toContain("No holdings found"); // Or similar, if NEmpty was used
    // This is more of a design consideration for the component itself.
    // The current component will just render empty tables.
    const tables = wrapper.findAll('table');
    expect(tables[0].findAll('tr').length).toBe(0);
    expect(tables[1].findAll('tr').length).toBe(0);
  });
});
