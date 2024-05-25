import { setupPreference } from '@vben/preference';

import { overridesPreference } from './preference';

/**
 * 应用初始化完成之后再进行页面加载渲染
 */
async function initApplication() {
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${env}`;

  // app偏好设置初始化
  await setupPreference({
    namespace,
    overrides: overridesPreference,
  });

  import('./bootstrap').then((m) => m.bootstrap(namespace));
}

initApplication();
