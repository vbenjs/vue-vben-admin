export interface IAnyObject<T = any> {
  [key: string]: T;
}

export interface IInputEvent {
  target: {
    value: any;
    checked: boolean;
  };
}
