import BasicFormLib from './src/BasicForm.vue';
import { withInstall } from '../util';

export * from './src/types/form';
export * from './src/types/formItem';

export { useComponentRegister } from './src/hooks/useComponentRegister';
export { useForm } from './src/hooks/useForm';

export const BasicForm = withInstall(BasicFormLib);
