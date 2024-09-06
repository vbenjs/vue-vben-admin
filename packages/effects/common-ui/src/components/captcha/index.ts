export { default as PointSelectionCaptcha } from './point-selection-captcha.vue';
export interface Point {
  i: number;
  x: number;
  y: number;
  t: number;
}
export type ClearFunction = () => void;
