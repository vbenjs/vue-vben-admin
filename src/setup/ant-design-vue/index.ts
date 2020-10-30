// Load on demand

import type { App } from 'vue';

import { Form, Input } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

import './spin';

export function setupAntd(app: App<Element>) {
  // 这两个组件在登录也就用。全局注册
  app.use(Form);
  app.use(Input);
}
