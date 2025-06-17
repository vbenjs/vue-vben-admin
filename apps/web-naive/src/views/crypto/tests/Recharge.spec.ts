import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Recharge from '../Recharge.vue'; // Adjust path as necessary
import { useCryptoStore } from '#/store/crypto'; // Adjust path to your store

// Mock Naive UI components
vi.mock('naive-ui', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    NCard: { template: '<div><slot></slot></div>' },
    NSpace: { template: '<div><slot></slot></div>' },
    NH3: { template: '<h3><slot></slot></h3>' },
    NStatistic: { props: ['label', 'value'], template: '<div>{{ label }}: {{ value }}</div>' },
    NDivider: { template: '<hr/>' },
    NForm: { emits: ['submit'], template: '<form @submit.prevent="$emit(\'submit\')"><slot></slot></form>' },
    NFormItemRow: { template: '<div><slot></slot></div>' },
    NRadioGroup: { props: ['value'], emits: ['update:value'], template: '<div><slot></slot></div>' }, // Simplified
    NRadioButton: { props: ['value', 'label'], template: '<label><input type="radio" :value="value" @change="$parent.$emit(\'update:value\', value)" />{{ label || value }}</label>' },
    NInputNumber: { props: ['value', 'min'], emits: ['update:value'], template: '<input type="number" :value="value" @input="$emit(\'update:value\', parseInt($event.target.value))" />' },
    NButton: { emits: ['click'], template: '<button @click="$emit(\'click\')"><slot></slot></button>' },
    useMessage: () => ({
        error: vi.fn(),
        success: vi.fn(),
    }),
  };
});

describe('Recharge.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    // Component uses its own tokenBalances ref, store is not directly used for display here
  });

  it('renders initial balances and recharge form', () => {
    const wrapper = mount(Recharge, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain('LIKE Tokens: 1000'); // From component's default
    expect(wrapper.text()).toContain('USDT Tokens: 500');  // From component's default
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findAll('input[type="radio"]').length).toBe(2);
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    expect(wrapper.find('button[type="primary"]').text()).toBe('Recharge Tokens');
  });

  it('updates form values on input', async () => {
    const wrapper = mount(Recharge, {
      global: {
        plugins: [pinia],
      },
    });

    // Simulate selecting radio button
    // This is tricky with the current NRadioButton mock, let's set value directly
    wrapper.vm.formValue.tokenType = 'usdt';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formValue.tokenType).toBe('usdt');


    const amountInput = wrapper.find('input[type="number"]');
    await amountInput.setValue(100);
    expect(wrapper.vm.formValue.amount).toBe(100);
  });

  it('calls rechargeTokens and updates local balance on form submit', async () => {
    const store = useCryptoStore(); // Store is not used by component for this logic
    const rechargeStoreActionSpy = vi.spyOn(store, 'rechargeTokens'); // Spy, but component doesn't call it

    const mockMessage = { error: vi.fn(), success: vi.fn() };
    vi.mocked(require('naive-ui').useMessage).mockReturnValue(mockMessage);

    const wrapper = mount(Recharge, {
      global: {
        plugins: [pinia],
      },
    });

    wrapper.vm.formValue.tokenType = 'like';
    wrapper.vm.formValue.amount = 200;
    await wrapper.vm.$nextTick();

    // Mock formRef.value.validate to succeed
    wrapper.vm.formRef = { validate: (cb) => cb(undefined) };
    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    // Component's own rechargeTokens method updates its local tokenBalances
    expect(wrapper.vm.tokenBalances.like).toBe(1000 + 200); // Initial 1000 + 200
    expect(mockMessage.success).toHaveBeenCalledWith('200 LIKE tokens recharged (mock).');
    expect(wrapper.vm.formValue.amount).toBeNull(); // Form reset

    // The component does NOT call the store's rechargeTokens action in its current implementation.
    expect(rechargeStoreActionSpy).not.toHaveBeenCalled();
  });

  it('shows error if amount is invalid', async () => {
    const mockMessage = { error: vi.fn(), success: vi.fn() };
    vi.mocked(require('naive-ui').useMessage).mockReturnValue(mockMessage);

    const wrapper = mount(Recharge, {
      global: {
        plugins: [pinia],
      },
    });

    wrapper.vm.formValue.tokenType = 'like';
    wrapper.vm.formValue.amount = 0; // Invalid amount
    await wrapper.vm.$nextTick();

    // Mock formRef.value.validate to fail for this case based on rules
    // The rule is: validator: (rule:any, value:any) => value > 0
    // So, if validate is called, it would pass an error.
    wrapper.vm.formRef = { validate: (cb) => cb([{ message: 'Amount must be positive' }]) };
    await wrapper.vm.$nextTick();


    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(mockMessage.error).toHaveBeenCalledWith('Please correct the form errors.');
    expect(wrapper.vm.tokenBalances.like).toBe(1000); // Balance should not change
  });
});
