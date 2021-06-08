import { App, Plugin } from 'vue';

export const install = <T>(component: T, alias?: string) => {
  const C = component as any;
  C.install = (app: App) => {
    app.component(C.name, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};
