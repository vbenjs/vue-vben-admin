import { MOCK_ORDERS } from '~/utils/mock-data';

export default eventHandler((event) => {
  return useResponseSuccess(MOCK_ORDERS);
});
