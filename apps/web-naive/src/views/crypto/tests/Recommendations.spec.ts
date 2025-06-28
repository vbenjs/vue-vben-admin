import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import Recommendations from '../Recommendations.vue'; // Adjust path as necessary
import { useCryptoStore } from '#/store/crypto'; // Adjust path to your store

// Mock Naive UI components to avoid rendering them
// This is a basic level of mocking. More specific mocks might be needed.
vi.mock('naive-ui', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    NCard: { template: '<div><slot></slot></div>' },
    NSpace: { template: '<div><slot></slot></div>' },
    NH3: { template: '<h3><slot></slot></h3>' },
    NStatistic: { props: ['label', 'value'], template: '<div>{{ label }}: {{ value }}</div>' },
    NForm: { emits: ['submit'], template: '<form @submit.prevent="$emit(\'submit\')"><slot></slot></form>' },
    NFormItemRow: { template: '<div><slot></slot></div>' },
    NSelect: { props: ['value', 'options', 'placeholder'], emits: ['update:value'], template: '<select @change="$emit(\'update:value\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>' },
    NButton: { emits: ['click'], template: '<button @click="$emit(\'click\')"><slot></slot></button>' },
    useMessage: () => ({
        error: vi.fn(),
        success: vi.fn(),
    }),
  };
});


describe('Recommendations.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it('renders the form and initial elements', () => {
    const store = useCryptoStore();
    store.tokens = 5000; // Set initial mock token balance

    const wrapper = mount(Recommendations, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.find('h3').text()).toContain('Your Token Balance');
    // Check for statistic display (highly depends on how NStatistic is mocked or if it renders text)
    // For this mock, it will be "Tokens: 5000"
    expect(wrapper.text()).toContain('Tokens: 5000');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findAll('select').length).toBe(3); // Currency, Timeframe, Risk Appetite
    expect(wrapper.find('button[type="primary"]').text()).toBe('Get Recommendation');
  });

  it('allows form fields to be filled', async () => {
    const wrapper = mount(Recommendations, {
      global: {
        plugins: [pinia],
      },
    });

    // Simulate selecting values. This depends heavily on how NSelect is mocked or interacted with.
    // The current NSelect mock is a basic HTML select.
    const selects = wrapper.findAll('select');
    await selects[0].setValue('BTC'); // Currency
    await selects[1].setValue('4h');  // Timeframe
    await selects[2].setValue('High'); // Risk Appetite

    // To verify, you might need to check component's internal state if not using v-model directly to store
    // For this component, formValue is reactive
    expect(wrapper.vm.formValue.currency).toBe('BTC');
    expect(wrapper.vm.formValue.timeframe).toBe('4h');
    expect(wrapper.vm.formValue.riskAppetite).toBe('High');
  });

  it('calls generateRecommendation action on form submit with correct payload', async () => {
    const store = useCryptoStore();
    // Spy on the action
    const generateRecommendationSpy = vi.spyOn(store, 'generateRecommendation');
    // Mock a successful response for the action
    generateRecommendationSpy.mockResolvedValue({
      recommendation: 'Mocked AI Rec for BTC',
      orderDetails: { action: 'BUY', currency: 'BTC' },
    });
    store.tokens = 1000; // Ensure enough tokens for the call

    const wrapper = mount(Recommendations, {
      global: {
        plugins: [pinia],
      },
    });

    // Set form values
    wrapper.vm.formValue.currency = 'BTC';
    wrapper.vm.formValue.timeframe = '1d';
    wrapper.vm.formValue.riskAppetite = 'Medium';
    await wrapper.vm.$nextTick(); // Wait for reactivity

    await wrapper.find('form').trigger('submit');

    expect(generateRecommendationSpy).toHaveBeenCalledTimes(1);
    expect(generateRecommendationSpy).toHaveBeenCalledWith({
      currency: 'BTC',
      timeframe: '1d',
      riskAppetite: 'Medium',
    });

    // Check if results are displayed (basic check)
    await wrapper.vm.$nextTick(); // Wait for conditional rendering
    expect(wrapper.text()).toContain('Recommendation Result');
    expect(wrapper.text()).toContain('Mocked AI Rec for BTC');
  });

  it('shows error message if fields are not filled on submit', async () => {
    // useMessage is mocked, so we can spy on its methods
    const mockMessage = { error: vi.fn(), success: vi.fn() };
    vi.mocked(require('naive-ui').useMessage).mockReturnValue(mockMessage);


    const wrapper = mount(Recommendations, {
      global: {
        plugins: [pinia],
        mocks: {
          // If useMessage is called directly in setup, this might be one way
          // For this component, useMessage() is called at the top of <script setup>
        }
      }
    });

    await wrapper.find('form').trigger('submit');
    expect(mockMessage.error).toHaveBeenCalledWith('Please fill in all fields.');
  });


  it('displays recommendation and order details after successful API call', async () => {
    const store = useCryptoStore();
    const mockRec = 'Test recommendation';
    const mockOrder = { item: 'Test BTC', amount: 1 };
    vi.spyOn(store, 'generateRecommendation').mockResolvedValue({
      recommendation: mockRec,
      orderDetails: mockOrder,
    });
    store.tokens = 1000;


    const wrapper = mount(Recommendations, {
      global: {
        plugins: [pinia],
      },
    });

    wrapper.vm.formValue.currency = 'ETH';
    wrapper.vm.formValue.timeframe = '4h';
    wrapper.vm.formValue.riskAppetite = 'Low';
    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick(); // Wait for UI update

    expect(wrapper.text()).toContain('Recommendation Result');
    expect(wrapper.text()).toContain(mockRec);
    expect(wrapper.text()).toContain(JSON.stringify(mockOrder, null, 2));
  });
});
