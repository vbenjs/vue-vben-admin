/**
 * @description: 输入框事件
 */
declare interface ChangeEvent extends Event {
  target: HTMLInputElement;
}
interface WheelEvent {
  path?: EventTarget[];
}
