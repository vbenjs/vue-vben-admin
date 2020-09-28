// Load on demand

import type { App } from 'vue';

import { Form, Input, Button } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import './spin';

export function setupAntd(app: App<Element>) {
  app.component(Button.Group.name, Button.Group);
  app.use(Form);
  app.use(Input);
}
