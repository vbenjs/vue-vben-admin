import { eventHandler, getQuery, setResponseStatus } from 'h3';
import { firstQueryString } from '~/utils/query';
import { useResponseError } from '~/utils/response';

export default eventHandler((event) => {
  const { status } = getQuery(event);
  setResponseStatus(event, Number(status));
  return useResponseError(firstQueryString(status));
});
