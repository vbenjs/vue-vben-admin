<template>
  <div class="portfolio-view">
    <n-card title="My Crypto Portfolio">
      <n-space vertical :size="32">
        <section>
          <n-h2>Current Holdings</n-h2>
          <n-data-table
            :columns="holdingsColumns"
            :data="currentHoldings"
            :pagination="false"
            :bordered="false"
          />
        </section>

        <n-divider />

        <section>
          <n-h2>Historical Positions</n-h2>
          <n-data-table
            :columns="positionsColumns"
            :data="historicalPositions"
            :pagination="{ pageSize: 5 }"
            :bordered="false"
          />
        </section>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { NCard, NDataTable, NH2, NSpace, NDivider, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';

interface Holding {
  id: string;
  asset: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  purchasePrice: number;
}

interface Position {
  id: string;
  asset: string;
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  timestamp: string;
  status: 'OPEN' | 'CLOSED';
  pnl: number | string;
}

const currentHoldings = ref<Holding[]>([
  { id: 'btc', asset: 'Bitcoin (BTC)', amount: 2.5, currentPrice: 50000, totalValue: 125000, purchasePrice: 45000 },
  { id: 'eth', asset: 'Ethereum (ETH)', amount: 10, currentPrice: 3000, totalValue: 30000, purchasePrice: 2500 },
  { id: 'ada', asset: 'Cardano (ADA)', amount: 5000, currentPrice: 0.5, totalValue: 2500, purchasePrice: 0.4 },
]);

const historicalPositions = ref<Position[]>([
  { id: 'sol-closed', asset: 'Solana (SOL)', entryPrice: 80, exitPrice: 120, amount: 100, timestamp: '2023-10-15T10:00:00Z', status: 'CLOSED', pnl: 4000 },
  { id: 'dot-open', asset: 'Polkadot (DOT)', entryPrice: 5, amount: 200, timestamp: '2024-01-20T14:30:00Z', status: 'OPEN', pnl: 'N/A' },
  { id: 'doge-closed', asset: 'Dogecoin (DOGE)', entryPrice: 0.05, exitPrice: 0.15, amount: 100000, timestamp: '2023-05-01T08:20:00Z', status: 'CLOSED', pnl: 10000 },
  { id: 'link-closed', asset: 'Chainlink (LINK)', entryPrice: 15, exitPrice: 12, amount: 50, timestamp: '2023-11-01T18:00:00Z', status: 'CLOSED', pnl: -150 },
]);

const holdingsColumns: DataTableColumns<Holding> = [
  { title: 'Asset', key: 'asset' },
  { title: 'Amount', key: 'amount' },
  { title: 'Purchase Price', key: 'purchasePrice', render: (row) => `$${row.purchasePrice.toFixed(2)}` },
  { title: 'Current Price', key: 'currentPrice', render: (row) => `$${row.currentPrice.toFixed(2)}` },
  { title: 'Total Value', key: 'totalValue', render: (row) => `$${row.totalValue.toFixed(2)}` },
];

const positionsColumns: DataTableColumns<Position> = [
  { title: 'Asset', key: 'asset' },
  { title: 'Entry Price', key: 'entryPrice', render: (row) => `$${row.entryPrice.toFixed(2)}` },
  { title: 'Exit Price', key: 'exitPrice', render: (row) => row.exitPrice ? `$${row.exitPrice.toFixed(2)}` : 'N/A' },
  { title: 'Amount', key: 'amount' },
  { title: 'Status', key: 'status', render(row) {
      return h(
        NTag,
        { type: row.status === 'OPEN' ? 'warning' : 'success' },
        { default: () => row.status }
      );
    },
  },
  { title: 'P/L', key: 'pnl', render(row) {
      if (typeof row.pnl === 'number') {
        return h(
          NTag,
          { type: row.pnl >= 0 ? 'success' : 'error'},
          { default: () => `$${row.pnl.toFixed(2)}`}
        );
      }
      return row.pnl;
    }
  },
  { title: 'Date', key: 'timestamp', render: (row) => new Date(row.timestamp).toLocaleDateString() },
];

</script>

<style scoped>
.portfolio-view {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}
</style>
