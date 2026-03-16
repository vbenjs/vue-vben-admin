import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Shanghai');

const dateUtil = dayjs;

export { dateUtil };
