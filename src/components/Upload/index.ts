import type { App } from 'vue';
import BasicUpload from './src/BasicUpload.vue';

export default (app: App): void => {
  app.component(BasicUpload.name, BasicUpload);
};

export { BasicUpload };
