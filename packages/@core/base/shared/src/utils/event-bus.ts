import type { EventType } from 'mitt';

import mitt from 'mitt';

export type EventKey = EventType;

const eventBus = mitt();

const emitEvent = (key: EventKey, data?: any) => {
  eventBus.emit(key, data);
};

const onEvent = (key: EventKey, handler: (data?: any) => void) => {
  eventBus.on(key, handler);
};

const offEvent = (key: EventKey, handler: (data?: any) => void) => {
  eventBus.off(key, handler);
};

export { emitEvent, offEvent, onEvent };
