import type { DemoInfo } from '/#/store';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { formatToDateTime } from '/@/utils/dateUtil';

export interface DemoInfoState {
  info: Nullable<DemoInfo[]>;
  id: number;
  title: string;
}

export const useDemoStore = defineStore({
  id: 'app-demo',
  state: (): DemoInfoState => ({
    id: -1,
    title: '',
    info: null,
  }),
  // 读取
  getters: {
    getInfo(): DemoInfo[] {
      return this.info || [];
    },
    getDemoId(): number {
      return this.id;
    },
    getTitle(): string {
      return this.title;
    },
  },
  // 改变动作
  actions: {
    addDemoInfo(info: DemoInfo): void {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      };
      this.info = [item, ...(this.info || [])];
    },
    setDemoIdAndTitle(id: number, title: string): void {
      this.id = id;
      this.title = title;
    },
  },
});

// Need to be used outside the setup
export function useDemoStoreWithOut() {
  return useDemoStore(store);
}
