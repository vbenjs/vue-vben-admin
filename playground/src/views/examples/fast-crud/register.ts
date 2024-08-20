import type { App } from 'vue';

import FastCrud from '@fast-crud/fast-crud';
import ui from '@fast-crud/ui-antdv4';
import Antdv from 'ant-design-vue';

import '@fast-crud/fast-crud/dist/style.css';
import '@fast-crud/ui-antdv4/dist/style.css';

export function registerFastCrud(app: App) {
  app.use(Antdv);
  app.use(ui);
  app.use(FastCrud, {});
}
