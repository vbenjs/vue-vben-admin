import type { ButtonProps as AndtButtonProps } from 'ant-design-vue';
import { withInstall } from '@/utils';
import type { ExtractPropTypes } from 'vue';
import button from './src/BasicButton.vue';
import popConfirmButton from './src/PopConfirmButton.vue';
import { buttonProps } from './src/props';
import popConfirmVxeButton from './src/PopConfirmVxeButton.vue';

export const Button = withInstall(button);
export const PopConfirmButton = withInstall(popConfirmButton);
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>> & AndtButtonProps;
export const PopConfirmVxeButton = withInstall(popConfirmVxeButton);
