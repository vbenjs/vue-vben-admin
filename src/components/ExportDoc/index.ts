import { defineAsyncComponent } from 'vue';
import { withInstall } from '@/utils/index';

const exportDoc = defineAsyncComponent(() => import('./ExportDoc.vue'));

export const ExportDoc = withInstall(exportDoc);

export { useExportDoc } from './src/functional';
