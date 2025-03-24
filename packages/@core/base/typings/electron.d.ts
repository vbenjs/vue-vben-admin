import type { IpcRendererEvent } from 'electron';

export type IpcRendererInvoke = 'open-win';

declare global {
  interface Window {
    ipcRenderer: {
      invoke: (channel: IpcRendererInvoke, ...args: any[]) => Promise<any>;
      off: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void,
      ) => void;
      on: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void,
      ) => void;
      send: (channel: string, data: any) => Promise<any>;
    };
  }
}

export {};
