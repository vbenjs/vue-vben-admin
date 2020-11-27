import BreadcrumbLib from './src/Breadcrumb.vue';
import BreadcrumbItemLib from './src/BreadcrumbItem.vue';
import { withInstall } from '../util';

export const Breadcrumb = withInstall(BreadcrumbLib);
export const BreadcrumbItem = withInstall(BreadcrumbItemLib);
