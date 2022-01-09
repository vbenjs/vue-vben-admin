import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client'
import { addClass, hasClass, removeClass } from '@admin/utils'

export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot')
  if (!htmlRoot) {
    return
  }
  const hasDarkClass = hasClass(htmlRoot, 'dark')
  if (mode === 'dark') {
    if (import.meta.env.PROD && !darkCssIsReady) {
      await loadDarkThemeCss()
    }
    htmlRoot.setAttribute('data-theme', 'dark')
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark')
    }
  } else {
    htmlRoot.setAttribute('data-theme', 'light')
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark')
    }
  }
}
