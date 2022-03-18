import type { App } from 'vue'
import { loading } from './src/loading'
import { auth } from './src/auth'

export { clickOutside } from './src/click-outside'
export { auth, loading }
export * from './bridge'

export const registerGlobalDirective = (app: App) => {
  app.directive('loading', loading)
  app.directive('auth', auth)
}
