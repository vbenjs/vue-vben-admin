import { RouterLink, RouterView } from 'vue-router';

import { Button } from '/@/components/Button';
import { Col, Row } from 'ant-design-vue';

declare global {
  interface __VLS_GlobalComponents {
    RouterLink: typeof RouterLink;
    RouterView: typeof RouterView;
    'a-button': typeof Button;
    'a-col': typeof Col;
    'a-row': typeof Row;
  }
}
