import type { VbenPluginsOptions } from './types';

import { createContext } from '@vben-core/shadcn-ui';

export const [injectPluginsOptions, providePluginsOptions] =
  createContext<VbenPluginsOptions>('VbenPluginsOptions');
