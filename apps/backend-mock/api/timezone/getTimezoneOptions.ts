import { eventHandler } from 'h3';
import { TIME_ZONE_OPTIONS } from '~/utils/mock-data';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(() => {
  const data = TIME_ZONE_OPTIONS.map((o) => ({
    label: `${o.timezone} (GMT${o.offset >= 0 ? `+${o.offset}` : o.offset})`,
    value: o.timezone,
  }));
  return useResponseSuccess(data);
});
