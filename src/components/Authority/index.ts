import type { App } from 'vue';
import Authority from './src/index.vue';

export default (app: App): void => {
  app.component(Authority.name, Authority);
};

export { Authority };
