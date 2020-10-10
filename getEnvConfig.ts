import type { GlobEnvConfig } from './src/types/config';

export const getGlobEnvConfig = (): GlobEnvConfig => {
  const env = import.meta.env;
  return (env as unknown) as GlobEnvConfig;
};
