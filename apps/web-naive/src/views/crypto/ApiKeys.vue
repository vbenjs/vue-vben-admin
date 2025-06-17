<template>
  <div class="apikeys-view">
    <n-card title="Manage Exchange API Keys">
      <n-space vertical :size="24">
        <n-h3>Add New API Key</n-h3>
        <n-form @submit.prevent="saveApiKey" ref="formRef">
          <n-form-item-row label="Exchange" path="exchange">
            <n-select
              v-model:value="formValue.exchange"
              placeholder="Select Exchange"
              :options="exchangeOptions"
            />
          </n-form-item-row>
          <n-form-item-row label="API Key" path="apiKey">
            <n-input
              v-model:value="formValue.apiKey"
              placeholder="Enter your API Key"
            />
          </n-form-item-row>
          <n-form-item-row label="API Secret" path="apiSecret">
            <n-input
              type="password"
              show-password-on="click"
              v-model:value="formValue.apiSecret"
              placeholder="Enter your API Secret"
            />
          </n-form-item-row>
          <n-button type="primary" attr-type="submit">Save API Key</n-button>
        </n-form>

        <n-divider />

        <n-h3>Your API Keys</n-h3>
        <div v-if="savedKeys.length === 0">
          <n-empty description="No API keys saved yet." />
        </div>
        <n-list bordered v-else>
          <n-list-item v-for="key in savedKeys" :key="key.id">
            <template #prefix>
              <n-tag type="info">{{ key.exchange }}</n-tag>
            </template>
            <n-thing :title="`${key.exchange} Key`">
              API Key: {{ maskApiKey(key.apiKey) }}
            </n-thing>
             <template #suffix>
              <n-button type="error" size="small" @click="removeApiKey(key.id)">Remove</n-button>
            </template>
          </n-list-item>
        </n-list>
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
  NInput,
  NButton,
  NSpace,
  NH3,
  NList,
  NListItem,
  NThing,
  NTag,
  NDivider,
  NEmpty,
  useMessage,
  type FormInst, // For form validation type
} from 'naive-ui';

const message = useMessage();
const formRef = ref<FormInst | null>(null); // For form validation

interface ApiKey {
  id: string;
  exchange: string | null;
  apiKey: string | null;
  apiSecret: string | null;
}

const formValue = reactive<ApiKey>({
  id: '',
  exchange: null,
  apiKey: null,
  apiSecret: null,
});

const exchangeOptions = ref([
  { label: 'Binance', value: 'Binance' },
  { label: 'Coinbase Pro', value: 'CoinbasePro' },
  { label: 'Kraken', value: 'Kraken' },
  { label: 'Bybit', value: 'Bybit' },
]);

const savedKeys = ref<ApiKey[]>([
  { id: 'key1', exchange: 'Binance', apiKey: 'abc123xyz789', apiSecret: 'secret1' },
  { id: 'key2', exchange: 'CoinbasePro', apiKey: 'def456uvw123', apiSecret: 'secret2' },
]);

const rules = {
  exchange: { required: true, message: 'Please select an exchange', trigger: 'blur' },
  apiKey: { required: true, message: 'Please input your API key', trigger: 'blur' },
  apiSecret: { required: true, message: 'Please input your API secret', trigger: 'blur' },
};

const saveApiKey = () => {
  formRef.value?.validate(errors => {
    if (!errors) {
      // Placeholder for API call
      const newKey = { ...formValue.value, id: `key${Date.now()}` }; // Create a unique ID
      savedKeys.value.push(newKey);
      message.success(`${formValue.value.exchange} API Key saved (mock).`);
      // Reset form
      formValue.id = '';
      formValue.exchange = null;
      formValue.apiKey = null;
      formValue.apiSecret = null;
    } else {
      message.error('Please correct the errors in the form.');
    }
  });
};

const removeApiKey = (id: string) => {
  savedKeys.value = savedKeys.value.filter(key => key.id !== id);
  message.info('API Key removed (mock).');
};

const maskApiKey = (key: string | null) => {
  if (!key) return 'N/A';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};
</script>

<style scoped>
.apikeys-view {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
}
</style>
