import { isBrowser } from './isBrowser';

export function isDocumentVisible(): boolean {
  if (isBrowser) {
    return document.visibilityState !== 'hidden';
  }
  return true;
}
