import { eventHandler } from 'h3';
import { TIME_ZONE_OPTIONS } from '~/utils/mock-data';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(() => {
  return useResponseSuccess(TIME_ZONE_OPTIONS);
});
