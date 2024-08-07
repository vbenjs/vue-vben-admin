interface IBreadcrumb {
  icon?: string;
  isHome?: boolean;
  items?: IBreadcrumb[];
  path?: string;
  title?: string;
}

export type { IBreadcrumb };
