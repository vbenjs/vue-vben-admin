import { eventHandler, getHeader } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  sleep,
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response';

interface OrderResult {
  createdAt: string;
  orderId: string;
}

let orderSeq = 0;
// 缓存进行中的 Promise 而不是结果，同一个键的并发请求也只会创建一个订单
const orders = new Map<string, Promise<OrderResult>>();

async function createOrder(): Promise<OrderResult> {
  await sleep(600);
  orderSeq += 1;
  return {
    createdAt: new Date().toISOString(),
    orderId: `ORDER-${String(orderSeq).padStart(4, '0')}`,
  };
}

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const idempotencyKey = getHeader(event, 'Idempotency-Key') ?? null;
  if (!idempotencyKey) {
    return useResponseSuccess({
      ...(await createOrder()),
      idempotencyKey,
      replayed: false,
    });
  }

  const existing = orders.get(idempotencyKey);
  const pending = existing ?? createOrder();
  if (!existing) {
    orders.set(idempotencyKey, pending);
  }
  return useResponseSuccess({
    ...(await pending),
    idempotencyKey,
    replayed: Boolean(existing),
  });
});
