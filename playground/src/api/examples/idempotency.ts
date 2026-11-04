import { requestClient } from '#/api/request';

interface IdempotentOrderResult {
  createdAt: string;
  idempotencyKey: null | string;
  orderId: string;
  replayed: boolean;
}

/**
 * 提交订单
 * @param idempotencyKey 幂等键配置，不传时由拦截器自动生成
 */
async function submitIdempotentOrder(idempotencyKey?: boolean | string) {
  return requestClient.post<IdempotentOrderResult>(
    '/demo/idempotency',
    {},
    { idempotencyKey },
  );
}

export { submitIdempotentOrder };
export type { IdempotentOrderResult };
