export { default as Drawer } from './src/index.vue';

// export const Drawer = () => (import('./src/index.vue') as any) as VueConstructor<Vue>;
// export const Drawer = getAsyncComponent(() => import('./src/index.vue'));

export { useDrawer } from './src/useDrawer';
export * from './src/types';
