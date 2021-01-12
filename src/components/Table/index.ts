import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export { default as BasicTable } from './src/BasicTable.vue';
export { default as TableAction } from './src/components/TableAction.vue';
export { default as EditTableHeaderIcon } from './src/components/EditTableHeaderIcon.vue';

export const TableImg = createAsyncComponent(() => import('./src/components/TableImg.vue'));

export * from './src/types/table';
export * from './src/types/pagination';
export * from './src/types/tableAction';

export { useTable } from './src/hooks/useTable';

export type { FormSchema, FormProps } from '/@/components/Form/src/types/form';

export type { EditRecordRow } from './src/components/editable';
