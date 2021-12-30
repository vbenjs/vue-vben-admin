import type { App } from 'vue'

import { loading } from './src/loading'
import { auth } from './src/auth'

export { ripple } from './src/ripple'
export { clickOutside } from './src/clickOutside'
export { auth, loading }

export const registerGlobalDirective = (app: App) => {
  app.directive('loading', loading)
  app.directive('auth', auth)
}
