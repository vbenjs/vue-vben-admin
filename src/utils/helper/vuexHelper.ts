import store from '/@/store';

export function hotModuleUnregisterModule(name: string) {
  if (!name || !import.meta.hot) return;
  if ((store.state as Recordable)[name]) {
    store.unregisterModule(name);
  }
}
