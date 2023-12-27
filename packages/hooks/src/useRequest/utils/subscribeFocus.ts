import { isBrowser } from './isBrowser';
import { isDocumentVisible } from './isDocumentVisible';
import { isOnline } from './isOnline';

type Listener = () => void;

const listeners: Listener[] = [];

if (isBrowser) {
  const revalidate = () => {
    if (!isDocumentVisible() || !isOnline()) return;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };
  window.addEventListener('visibilitychange', revalidate, false);
  window.addEventListener('focus', revalidate, false);
}

export default function subscribe(listener: Listener) {
  listeners.push(listener);

  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}
