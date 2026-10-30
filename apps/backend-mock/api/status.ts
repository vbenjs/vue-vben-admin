import { eventHandler, getQuery, setResponseStatus } from 'h3';
import { firstQueryString } from '~/utils/query';
import { useResponseError } from '~/utils/response';

export default eventHandler((event) => {
  const { status } = getQuery(event);
  const statusValue = firstQueryString(status);
  setResponseStatus(event, Number(statusValue));
  return useResponseError(statusValue);
});
