import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:layers-outline',
      keepAlive: true,
      order: 1000,
      title: '任务',
    },
    name: 'Task',
    path: '/task',
    children: [
      {
        name: 'TaskList',
        path: '/task/task-list',
        component: () => import('#/myViews/taskList.vue'),
        meta: {
          icon: 'mdi:form-select',
          title: '任务列表',
        },
      },
    ],
  },
];

export default routes;
