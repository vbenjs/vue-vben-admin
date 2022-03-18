/**
 * @description: default layout
 */
export const LAYOUT = () => import('@/layouts/default/index.vue')

/**
 * @description: parent-layout
 */
export const getParentLayout = () => () =>
  new Promise((resolve) => {
    resolve({ name: 'ParentLayout' })
  })
