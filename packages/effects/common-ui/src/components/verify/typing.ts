export interface DragVerifyActionType {
  resume: () => void;
}

export interface VerifyPassingData {
  isPassing: boolean;
  time: number;
}

export interface VerifyMoveData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}
