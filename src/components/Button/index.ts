import { withInstall } from '@/utils';
import type { ExtractPropTypes } from 'vue';
import button from './src/BasicButton.vue';
import popConfirmButton from './src/PopConfirmButton.vue';
import apiButton from './src/ApiButton.vue';
import { buttonProps } from './src/props';

export const Button = withInstall(button);
export const PopConfirmButton = withInstall(popConfirmButton);
export const ApiButton = withInstall(apiButton);
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
