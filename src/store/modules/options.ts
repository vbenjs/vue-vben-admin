import { EnumsVo } from '@/ApiModel';
import { defineStore } from 'pinia';
import { isArray } from 'lodash-es';

interface OptionState {
  [index: string]: EnumsVo[];
}

export const useOptionStore = defineStore({
  id: 'app-option',
  state: (): OptionState => ({}),
  actions: {
    async initOptions(fn: () => Promise<EnumsVo[]>, type: string) {
      const options = this[type] as EnumsVo[];
      if (options.length) return options;
      const data = await fn();
      this[type] = data;
      return data;
    },
    getOptionName(text: string = '', type: string): string | undefined {
      const options = this[type];
      return isArray(options) ? options.find((item) => item.code === text)?.name : '';
    },
  },
});
