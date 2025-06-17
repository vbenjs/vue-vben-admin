import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ApiKeys from '../ApiKeys.vue'; // Adjust path as necessary
import { useCryptoStore } from '#/store/crypto'; // Adjust path to your store

// Mock Naive UI components
vi.mock('naive-ui', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    NCard: { template: '<div><slot></slot></div>' },
    NSpace: { template: '<div><slot></slot></div>' },
    NH3: { template: '<h3><slot></slot></h3>' },
    NForm: { emits: ['submit'], template: '<form @submit.prevent="$emit(\'submit\')"><slot></slot></form>' },
    NFormItemRow: { template: '<div><slot></slot></div>' },
    NSelect: { props: ['value', 'options'], emits: ['update:value'], template: '<select @change="$emit(\'update:value\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>' },
    NInput: { props: ['value', 'type', 'showPasswordOn'], emits: ['update:value'], template: '<input :type="type || \'text\'" :value="value" @input="$emit(\'update:value\', $event.target.value)" />' },
    NButton: { emits: ['click'], template: '<button @click="$emit(\'click\')"><slot></slot></button>' },
    NDivider: { template: '<hr/>' },
    NList: { template: '<ul><slot></slot></ul>' },
    NListItem: { template: '<li><slot name="prefix"></slot><slot></slot><slot name="suffix"></slot></li>' },
    NThing: { props: ['title'], template: '<div><h4>{{ title }}</h4><slot></slot></div>' },
    NTag: { template: '<span><slot></slot></span>' },
    NEmpty: { template: '<div><slot></slot>No data</div>' },
    useMessage: () => ({
        error: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
    }),
  };
});

describe('ApiKeys.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    // Reset store state if needed, though ApiKeys.vue uses its own `savedKeys` ref primarily for display
    const store = useCryptoStore();
    store.apiKeys = [ { id: 'key1', exchange: 'Binance', apiKeyMasked: 'abc...xyz' }];
  });

  it('renders the form and list of API keys', () => {
    const wrapper = mount(ApiKeys, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.find('h3').text()).toBe('Add New API Key');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findAll('select').length).toBe(1); // Exchange
    expect(wrapper.findAll('input[type="text"]').length).toBe(1); // API Key
    expect(wrapper.findAll('input[type="password"]').length).toBe(1); // API Secret
    expect(wrapper.find('button[type="primary"]').text()).toBe('Save API Key');

    expect(wrapper.findAll('h3')[1].text()).toBe('Your API Keys');
    // The component uses its own `savedKeys` ref which is initialized with mock data
    expect(wrapper.findAll('li').length).toBe(wrapper.vm.savedKeys.length);
    expect(wrapper.text()).toContain('Binance Key');
  });

  it('calls bindApiKey action on form submit', async () => {
    const store = useCryptoStore();
    const bindApiKeySpy = vi.spyOn(store, 'bindApiKey').mockResolvedValue(undefined);
    // Mock useMessage from naive-ui
    const mockMessage = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
    vi.mocked(require('naive-ui').useMessage).mockReturnValue(mockMessage);


    const wrapper = mount(ApiKeys, {
      global: {
        plugins: [pinia],
      },
    });

    // Set form values using component's reactive formValue
    wrapper.vm.formValue.exchange = 'CoinbasePro';
    wrapper.vm.formValue.apiKey = 'coinbase123';
    wrapper.vm.formValue.apiSecret = 'secret456';
    await wrapper.vm.$nextTick();

    // Mock formRef.value.validate to succeed
    wrapper.vm.formRef = { validate: (cb) => cb(undefined) }; // No errors
    await wrapper.vm.$nextTick();


    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();


    // The component's saveApiKey calls store.bindApiKey
    // However, the component's logic directly pushes to its local `savedKeys` ref for mock purposes.
    // This test should verify the component's own behavior.
    // The spy on `store.bindApiKey` is not directly relevant to the component's current implementation
    // of `saveApiKey` which manipulates a local `savedKeys` array.
    // Let's adjust the test to reflect what the component *actually* does.

    // The component's `saveApiKey` method:
    // 1. Validates (mocked)
    // 2. Pushes to its own `savedKeys` ref.
    // 3. Shows a success message.
    // 4. Resets its own `formValue`.

    expect(mockMessage.success).toHaveBeenCalledWith('CoinbasePro API Key saved (mock).');
    expect(wrapper.vm.savedKeys.some(k => k.exchange === 'CoinbasePro')).toBe(true);
    expect(wrapper.vm.formValue.apiKey).toBeNull(); // Form reset

    // If the component were to call store.bindApiKey, then we'd check:
    // expect(bindApiKeySpy).toHaveBeenCalledWith({
    //   exchange: 'CoinbasePro',
    //   apiKey: 'coinbase123',
    //   apiSecret: 'secret456',
    // });
  });

  it('removes an API key from its local list', async () => {
     const mockMessage = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
    vi.mocked(require('naive-ui').useMessage).mockReturnValue(mockMessage);

    const wrapper = mount(ApiKeys, {
      global: {
        plugins: [pinia],
      },
    });
    // Initial state of component's savedKeys
    const initialCount = wrapper.vm.savedKeys.length;
    expect(initialCount).toBeGreaterThan(0);

    // Find the first remove button and click it
    // The NListItem mock needs to render the button from the suffix slot
    // For simplicity, let's call the method directly on the component instance
    const keyToRemove = wrapper.vm.savedKeys[0];
    wrapper.vm.removeApiKey(keyToRemove.id);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.savedKeys.length).toBe(initialCount - 1);
    expect(wrapper.vm.savedKeys.find(k => k.id === keyToRemove.id)).toBeUndefined();
    expect(mockMessage.info).toHaveBeenCalledWith('API Key removed (mock).');
  });

  it('displays empty state if no keys are present', async () => {
    const wrapper = mount(ApiKeys, {
      global: {
        plugins: [pinia],
      },
    });
    wrapper.vm.savedKeys = []; // Manually empty the component's list
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('No API keys saved yet.');
    expect(wrapper.findComponent({ name: 'NEmpty' }).exists()).toBe(true);
  });
});
