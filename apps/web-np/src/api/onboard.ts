import { requestClient } from '#/api/request';

async function onboardFinished(data: any) {
  return requestClient.post('/api/shop/onboard', data);
}

export { onboardFinished };
