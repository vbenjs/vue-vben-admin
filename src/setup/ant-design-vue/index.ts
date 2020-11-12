// Load on demand

import type { App } from 'vue';

import {
  // need
  Form,
  Input,
  Row,
  Col,
  Spin,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import './spin';

export function setupAntd(app: App<Element>) {
  // need
  // Here are the components required before registering and logging in
  app.use(Form).use(Input).use(Row).use(Col).use(Spin);
}
