import { getAsyncComponent } from '@/common/factory/getAsyncComponent';
// export { default as TableAction } from './src/components/TableAction.vue';
// export { default as TableImg } from './src/components/TableImg.vue';
export { renderEditableCell } from './src/components/renderEditableCell';
export { default as EditTableHeaderIcon } from './src/components/EditTableHeaderIcon.vue';
export { useTable } from './src/hooks/useTable';
export { FormSchema, FormProps } from '@/components/form/src/types/form';
export * from './src/types/table';
export * from './src/types/pagination';
export * from './src/types/tableAction';
export { default as BasicTable } from './src/BasicTable.vue';

// export const BasicTable = getAsyncComponent(() => import('./src/BasicTable.vue'));
export const TableAction = getAsyncComponent(() => import('./src/components/TableAction.vue'));
export const TableImg = getAsyncComponent(() => import('./src/components/TableImg.vue'));
