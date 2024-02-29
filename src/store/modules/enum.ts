import { defineStore } from 'pinia';
import { store } from '../index';
import { getEnums } from '@/api/home';
import { NameCodeResult } from '@/api/model/homeModel';
import { attributeColorMap } from '@/enums/attributeType';
import { sensorTypeColorMap } from '@/enums/sensorType';

export interface EnumOptionState {
  attributeTypeMap: Map<string, string>;
  attributeColorMap: Map<string, string>;
  attributeTypeOptions: EnumOptions[];
  conditionTypeMap: Map<string, string>;
  conditionTypeOptions: EnumOptions[];
  messageTypeMap: Map<string, string>;
  messageTypeOptions: EnumOptions[];
  sensorTypeMap: Map<string, string>;
  sensorColorMap: Map<string, string>;
  sensorTypeOptions: EnumOptions[];
  statTypeMap: Map<string, string>;
  statTypeOptions: EnumOptions[];
  terminalTypeMap: Map<string, string>;
  terminalTypeOptions: EnumOptions[];
}
export interface EnumOptions {
  value: string | number;
  label: string;
  children?: EnumOptions[];
}
export const useEnumStore = defineStore({
  id: 'app-option',
  state: (): EnumOptionState => ({
    attributeTypeMap: new Map(),
    attributeColorMap: new Map(),
    attributeTypeOptions: [],
    conditionTypeMap: new Map(),
    conditionTypeOptions: [],
    messageTypeMap: new Map(),
    messageTypeOptions: [],
    sensorTypeMap: new Map(),
    sensorColorMap: new Map(),
    sensorTypeOptions: [],
    statTypeMap: new Map(),
    statTypeOptions: [],
    terminalTypeMap: new Map(),
    terminalTypeOptions: [],
  }),
  getters: {
    getAttributeTypeMap(): Map<string, string> {
      return this.attributeTypeMap;
    },
    getAttributeColorMap(): Map<string, string> {
      return this.attributeColorMap;
    },
    getAttributeTypeOptions(): EnumOptions[] {
      return this.attributeTypeOptions;
    },
    getConditionTypeMap(): Map<string, string> {
      return this.conditionTypeMap;
    },
    getConditionTypeOptions(): EnumOptions[] {
      return this.conditionTypeOptions;
    },
    getMessageTypeMap(): Map<string, string> {
      return this.messageTypeMap;
    },
    getMessageTypeOptions(): EnumOptions[] {
      return this.conditionTypeOptions;
    },
  },
  actions: {
    async getEnumOptions() {
      const data = await getEnums();
      this.createAttributeType(data?.AttributeType);
      this.createConditionType(data?.ConditionType);
      this.createMessageType(data?.MessageType);
      this.createSensorType(data?.SensorType);
      this.createStatType(data?.StatType);
      this.createTerminalType(data?.TerminalType);
    },
    createAttributeType(data?: NameCodeResult[]) {
      const map = new Map();
      const colorMap = new Map();
      const options: EnumOptions[] = [];

      data?.forEach((item) => {
        map.set(item.code, item.name);
        const color = attributeColorMap.get(item.code) || 'purple';
        colorMap.set(item.code, color);
        options.push({
          label: item.name,
          value: item.code,
        });
      });
      this.attributeTypeMap = map;
      this.attributeColorMap = colorMap;
      this.attributeTypeOptions = options;
    },
    createConditionType(data?: NameCodeResult[]) {
      const map = new Map();
      const options: EnumOptions[] = [];

      data?.forEach((item) => {
        map.set(item.code, item.name);
        options.push({
          label: item.name,
          value: item.code,
        });
      });
      this.conditionTypeMap = map;
      this.conditionTypeOptions = options;
    },
    createMessageType(data?: NameCodeResult[]) {
      const map = new Map();
      const options: EnumOptions[] = [];

      data?.forEach((item) => {
        map.set(item.code, item.name);
        options.push({
          label: item.name,
          value: item.code,
        });
      });
      this.messageTypeMap = map;
      this.messageTypeOptions = options;
    },
    createSensorType(data?: NameCodeResult[]) {
      const map = new Map();
      const colorMap = new Map();
      const options: EnumOptions[] = [];

      data?.forEach((item) => {
        map.set(item.code, item.name);
        const color = sensorTypeColorMap.get(item.code) || 'purple';
        colorMap.set(item.code, color);
        options.push({
          label: item.name,
          value: item.code,
        });
      });
      this.sensorTypeMap = map;
      this.sensorColorMap = colorMap;
      this.sensorTypeOptions = options;
    },
    createStatType(data?: NameCodeResult[]) {
      const map = new Map();
      const options: EnumOptions[] = [];

      data?.forEach((item) => {
        map.set(item.code, item.name);
        options.push({
          label: item.name,
          value: item.code,
        });
      });
      this.statTypeMap = map;
      this.statTypeOptions = options;
    },
    createTerminalType(data?: NameCodeResult[]) {
      const map = new Map();
      const options: EnumOptions[] = [];

      data?.forEach((item) => {
        map.set(item.code, item.name);
        options.push({
          label: item.name,
          value: item.code,
        });
      });
      this.terminalTypeMap = map;
      this.terminalTypeOptions = options;
    },
  },
});

// Need to be used outside the setup
export function useEnumStoreWithOut() {
  return useEnumStore(store);
}
