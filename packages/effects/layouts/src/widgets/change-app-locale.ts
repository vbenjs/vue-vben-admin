import { changeLocale } from '@vben/locales';

export async function changeAppLocale(value?: string, onApplied?: () => void) {
  if (!value) return false;

  try {
    return await changeLocale(value, onApplied);
  } catch (error) {
    console.error(error);
    return false;
  }
}
