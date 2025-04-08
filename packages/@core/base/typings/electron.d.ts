import type { IpcRendererEvent } from 'electron';

export type IpcRendererInvoke =
  | 'app-close'
  | 'app-maximize'
  | 'app-minimize'
  | 'is-maximized'
  | 'open-win';

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
