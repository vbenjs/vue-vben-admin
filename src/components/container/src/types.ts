export type ScrollType = 'default' | 'main';

export enum TypeEnum {
  DEFAULT = 'default',
  MAIN = 'main',
}
export interface CollapseContainerOptions {
  canExpand?: boolean;
  title?: string;
  helpMessage?: Array<any> | string;
}
export interface ScrollContainerOptions {
  enableScroll?: boolean;
  type?: ScrollType;
}
