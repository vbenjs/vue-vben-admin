// Load on demand

import type { App } from 'vue';

import { Form, Input, Row, Col } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

import './spin';

export function setupAntd(app: App<Element>) {
  // Here are the components required before registering and logging in
  app.use(Form).use(Input).use(Row).use(Col);
}
