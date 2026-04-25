export interface DependencyInfo {
  name: string;
  version: string;
  icon: string;
}

declare global {
  const __VBEN_ADMIN_METADATA__: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
}

const CORE_DEPENDENCIES = [
  {
    name: 'vue',
    icon: 'ion:logo-vue',
  },
  {
    name: 'vite',
    icon: 'ion:flash',
  },
  {
    name: 'typescript',
    icon: 'ion:code-slash',
  },
  {
    name: 'tailwindcss',
    icon: 'ion:color-palette',
  },
];

export function getCoreDependencies(): DependencyInfo[] {
  const metadata = __VBEN_ADMIN_METADATA__ || {};
  const { dependencies = {}, devDependencies = {} } = metadata;

  return CORE_DEPENDENCIES.map((dep) => {
    const version = dependencies[dep.name] || devDependencies[dep.name] || '未知';
    return {
      ...dep,
      version,
    };
  });
}
