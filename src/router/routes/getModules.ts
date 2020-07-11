import { ModuleRouteConfig } from '@/router/type';

export function getModulesRoute(): ModuleRouteConfig[] {
  const res: ModuleRouteConfig[] = [];
  const routesModules = require.context('./modules/', true, /^[^_]*\.ts$/);

  routesModules.keys().forEach((fileName: string) => {
    try {
      const routeModule = routesModules(fileName).default as ModuleRouteConfig;
      routeModule && res.push(routeModule);
    } catch (error) {
      throw new Error(error);
    }
  });
  return res;
}
