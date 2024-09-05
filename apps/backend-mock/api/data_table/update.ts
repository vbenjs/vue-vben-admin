import { OrderInfo, MOCK_ORDERS } from '~/utils/mock-data';

export default defineEventHandler(async (event) => {
  const { action, data } = await readBody(event);
  if (!action || !data) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'action and row data are required',
    );
  }

  const findOrder = MOCK_ORDERS.find(
    (item) => item.id === data['id'],
  );

  // const codes =
  //   MOCK_CODES.find((item) => item.username === userinfo.username)?.codes ?? [];

  return useResponseSuccess(findOrder);
});
