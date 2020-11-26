import messages from 'globby?locale!/@/locales/lang/**/*.@(ts)';

import type { DropMenu } from '/@/components/Dropdown';

// locale list
export const localeList: DropMenu[] = [
  {
    text: '简体中文',
    event: 'zh_CN',
  },
  {
    text: 'English',
    event: 'en',
  },
];
export default messages;
