import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: 'Shops',
    },
    name: 'shops',
    path: '/shops',
    component: () => import('#/views/shops/index.vue'),
  },
];

export default routes;
