import { CSSProperties } from 'vue';

export interface WrapperProps {
  title?: string;
  dense: boolean;
  ghost: boolean;
  content: string;
  contentStyle?: CSSProperties;
  contentBackground: boolean;
  contentFullHeight: boolean;
  contentClass?: string;
  fixedHeight: boolean;
}
