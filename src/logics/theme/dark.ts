import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client';

export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot');
  if (mode === 'dark') {
    if (import.meta.env.PROD && !darkCssIsReady) {
      await loadDarkThemeCss();
    }
    htmlRoot?.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot?.setAttribute('data-theme', 'light');
  }
}
