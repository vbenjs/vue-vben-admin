export interface Axis {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  handler?: Fn;
  divider?: boolean;
  children?: ContextMenuItem[];
}
export interface Options {
  event: MouseEvent;
  icon?: string;
  styles?: any;
  items?: ContextMenuItem[];
}

export interface Instance extends Props {
  $el: HTMLDivElement;
}

export type Props = {
  resolve: (...arg) => void;
  event: MouseEvent;
  icon?: string;
  styles?: any;
  items: ContextMenuItem[];
  customEvent: MouseEvent;
  axis: Axis;
  width: number;
  showIcon?: boolean;
};
