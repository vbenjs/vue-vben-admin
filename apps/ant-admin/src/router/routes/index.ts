import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic'
import { mainOutRoutes } from './mainOut'
import { PageEnum } from '@pkg/tokens'
import { t } from '@pkg/locale'

const routeModuleRecord = import.meta.globEager('./modules/**/*.ts')

const routeModules: RouteRecordItem[] = []

Object.keys(routeModuleRecord).forEach((key) => {
  const routeModule = routeModuleRecord[key].default || {}
  routeModules.push(
    ...(Array.isArray(routeModule) ? [...routeModule] : [routeModule]),
  )
})

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModules]

export const RootRoute: RouteRecordItem = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

export const LoginRoute: RouteRecordItem = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
}

// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
]
