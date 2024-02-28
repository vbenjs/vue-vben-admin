import { EnumsVo } from '@/ApiModel';
import { getAllPrintTemplateType } from '@/api/configuration/printTemplate';
import { getAllErrType, getAllPortType } from '@/api/system/logs';
import { getAllBillType, getAllStatus } from '@/api/warehouse/bill';
import { getAllSource } from '@/api/warehouse/product';
import { billStatusOptions, billStatusMap, billStatusColorMap } from '@/enums/billStatus';
import { defineStore } from 'pinia';
import { isArray } from 'xe-utils';
interface OptionState {
  portType: EnumsVo[];
  errType: EnumsVo[];
  source: EnumsVo[];
  billType: EnumsVo[];
  billTypeOptions: EnumsVo[];
  statusType: EnumsVo[];
  templateType: EnumsVo[];
}
const colors = ['magenta', 'volcano', 'gold', 'lime', 'cyan', 'geekblue', 'pink'];

export const useOptionStore = defineStore({
  id: 'app-option',
  state: (): OptionState => ({
    portType: [],
    errType: [],
    source: [],
    billType: [],
    billTypeOptions: [],
    statusType: [],
    templateType: [],
  }),
  actions: {
    async initPortType() {
      if (this.portType.length) return this.portType;
      const data = await getAllPortType();
      this.portType = data;
      return data;
    },
    async initErrType() {
      if (this.errType.length) return this.errType;
      const data = await getAllErrType();
      this.errType = data;
      return data;
    },
    async initSource() {
      if (this.source.length) return this.source;
      const data = await getAllSource();
      this.source = data;
      return data;
    },
    async initBillType() {
      if (this.billTypeOptions.length) return this.billTypeOptions;
      const outClude = ['QUALITY', 'IN', 'OUT'];
      const data = await getAllBillType();
      this.billType = data;
      this.billTypeOptions = data.filter((item) => !outClude.includes(item.code));
      return this.billTypeOptions;
    },
    async initStatusType() {
      if (this.statusType.length) return this.statusType;
      const data = await getAllStatus();
      data.forEach((item) => {
        if (billStatusOptions.findIndex((item1) => item1.value === item.code) === -1) {
          billStatusOptions.push({ value: item.code, label: item.name });
          billStatusMap.set(item.code, item.name);
          const color = colors.pop();
          billStatusColorMap.set(item.code, color!);
        }
      });
      this.statusType = data;
      return this.statusType;
    },
    async initPrintTemplateType() {
      if (this.templateType.length) return this.templateType;
      const data = await getAllPrintTemplateType();
      this.templateType = data;
      return data;
    },
    getOptionName(text: string = '', type: string): string | undefined {
      const options = this[type];
      return isArray(options) && options.find((item) => item.code === text)?.name;
    },
  },
});
