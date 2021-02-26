declare interface ChangeEvent extends Event {
  target: HTMLInputElement;
}

declare interface WheelEvent {
  path?: EventTarget[];
}
