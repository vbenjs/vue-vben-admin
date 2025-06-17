<template>
  <div class="recommendations-view">
    <n-card title="Crypto Recommendations">
      <n-space vertical :size="24">
        <n-h3>Your Token Balance</n-h3>
        <n-statistic label="Tokens" :value="10000" /> <!-- Placeholder -->

        <n-h3>Get a New Recommendation</n-h3>
        <n-form @submit.prevent="getRecommendation">
          <n-form-item-row label="Cryptocurrency">
            <n-select
              v-model:value="formValue.currency"
              placeholder="Select Cryptocurrency"
              :options="currencyOptions"
            />
          </n-form-item-row>
          <n-form-item-row label="Timeframe">
            <n-select
              v-model:value="formValue.timeframe"
              placeholder="Select Timeframe"
              :options="timeframeOptions"
            />
          </n-form-item-row>
          <n-form-item-row label="Risk Appetite">
            <n-select
              v-model:value="formValue.riskAppetite"
              placeholder="Select Risk Appetite"
              :options="riskAppetiteOptions"
            />
          </n-form-item-row>
          <n-button type="primary" attr-type="submit">Get Recommendation</n-button>
        </n-form>

        <div v-if="recommendationResult" class="results-section">
          <n-h4>Recommendation Result</n-h4>
          <n-card title="AI Recommendation">
            <p>{{ recommendationResult.recommendation }}</p>
          </n-card>
          <n-card title="Order Details" style="margin-top: 16px;">
            <pre>{{ JSON.stringify(recommendationResult.orderDetails, null, 2) }}</pre>
          </n-card>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  NCard,
  NForm,
  NFormItemRow,
  NSelect,
  NButton,
  NSpace,
  NStatistic,
  NH3,
  NH4,
  useMessage, // Optional: for displaying messages
} from 'naive-ui';

// For Naive UI message handling (optional)
const message = useMessage();

const formValue = reactive({
  currency: null,
  timeframe: null,
  riskAppetite: null,
});

const currencyOptions = ref([
  { label: 'Bitcoin (BTC)', value: 'BTC' },
  { label: 'Ethereum (ETH)', value: 'ETH' },
  { label: 'Cardano (ADA)', value: 'ADA' },
  { label: 'Solana (SOL)', value: 'SOL' },
]);

const timeframeOptions = ref([
  { label: '1 Hour', value: '1h' },
  { label: '4 Hours', value: '4h' },
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1w' },
]);

const riskAppetiteOptions = ref([
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
]);

const recommendationResult = ref<{ recommendation: string; orderDetails: object } | null>(null);

const getRecommendation = async () => {
  if (!formValue.currency || !formValue.timeframe || !formValue.riskAppetite) {
    message.error('Please fill in all fields.'); // Optional: Naive UI message
    return;
  }
  // Placeholder for API call
  console.log('Form Submitted:', formValue);
  // Simulate API response
  recommendationResult.value = {
    recommendation: `This is a placeholder AI recommendation for ${formValue.currency} with ${formValue.riskAppetite} risk over ${formValue.timeframe}.`,
    orderDetails: {
      currency: formValue.currency,
      action: 'BUY',
      amount: Math.random() * 5,
      price: Math.random() * 60000,
      timestamp: new Date().toISOString(),
    },
  };
  message.success('Recommendation received!'); // Optional: Naive UI message
};
</script>

<style scoped>
.recommendations-view {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}
.results-section {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
