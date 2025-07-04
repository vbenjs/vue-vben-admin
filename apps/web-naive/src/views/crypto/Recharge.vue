<template>
  <div class="recharge-view">
    <n-card title="Recharge Tokens">
      <n-space vertical :size="24">
        <n-h3>Your Token Balances</n-h3>
        <n-space>
          <n-statistic label="LIKE Tokens" :value="tokenBalances.like" />
          <n-statistic label="USDT Tokens" :value="tokenBalances.usdt" />
        </n-space>

        <n-divider />

        <n-h3>Add More Tokens</n-h3>
        <n-form @submit.prevent="rechargeTokens" ref="formRef">
          <n-form-item-row label="Token Type" path="tokenType">
            <n-radio-group v-model:value="formValue.tokenType" name="tokenTypeGroup">
              <n-radio-button value="like">LIKE</n-radio-button>
              <n-radio-button value="usdt">USDT</n-radio-button>
            </n-radio-group>
          </n-form-item-row>

          <n-form-item-row label="Amount" path="amount">
            <n-input-number
              v-model:value="formValue.amount"
              placeholder="Enter amount"
              :min="1"
              style="width: 100%;"
            />
          </n-form-item-row>
          <n-button type="primary" attr-type="submit">Recharge Tokens</n-button>
        </n-form>
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
  NRadioGroup,
  NRadioButton,
  NInputNumber,
  NButton,
  NSpace,
  NStatistic,
  NH3,
  NDivider,
  useMessage,
  type FormInst,
} from 'naive-ui';

const message = useMessage();
const formRef = ref<FormInst | null>(null);

interface RechargeFormValue {
  tokenType: 'like' | 'usdt' | null;
  amount: number | null;
}

interface TokenBalances {
  like: number;
  usdt: number;
}

const formValue = reactive<RechargeFormValue>({
  tokenType: 'like', // Default selection
  amount: null,
});

// Placeholder for token balances - in a real app, this would come from a store or API
const tokenBalances = reactive<TokenBalances>({
  like: 1000,
  usdt: 500,
});

const rules = {
  tokenType: { required: true, message: 'Please select a token type' },
  amount: { type: 'number', required: true, message: 'Please enter an amount', trigger: ['blur', 'input'], validator: (rule:any, value:any) => value > 0 },
};


const rechargeTokens = () => {
  formRef.value?.validate(errors => {
    if (!errors) {
      // Placeholder for API call
      console.log('Recharge Submitted:', formValue);

      // Simulate updating balance
      if (formValue.tokenType && formValue.amount) {
        if (formValue.tokenType === 'like') {
          tokenBalances.like += formValue.amount;
        } else if (formValue.tokenType === 'usdt') {
          tokenBalances.usdt += formValue.amount;
        }
        message.success(`${formValue.amount} ${formValue.tokenType.toUpperCase()} tokens recharged (mock).`);
        formValue.amount = null; // Reset amount
      }
    } else {
      message.error('Please correct the form errors.');
    }
  });
};
</script>

<style scoped>
.recharge-view {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
}
</style>
