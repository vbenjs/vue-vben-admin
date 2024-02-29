const labelText = 'label';

// //不需要记录的
// BATTERY("电量", "%", false, false),
// LAST_CONNECT("上次通讯间隔时间", "S", false, false),

export type AttributeType =
  | 'ELECTRIC'
  | 'WORKING_HOURS'
  | 'TEMPERATURE'
  | 'HUMIDITY'
  | 'LUX'
  | 'PM25'
  | 'HCHO'
  | 'CO2'
  | 'PZG_FIRE_GEAR'
  | 'PZG_FIRE_POWER'
  | 'PZG_REQ_POWER'
  | 'PZG_SET_TIME'
  | 'PZG_RUN_TIME'
  | 'PZG_SET_TEMP'
  | 'PZG_RUN_TEMP'
  | 'PZG_RUN_COUNT'
  //不需要记录的
  | 'BATTERY'
  | 'LAST_CONNECT';

export const attributeTypeOptions = [
  { [labelText]: '能耗', value: 'ELECTRIC' },
  { [labelText]: '工作时长', value: 'WORKING_HOURS' },
  { [labelText]: '温度', value: 'TEMPERATURE' },
  { [labelText]: '湿度', value: 'HUMIDITY' },
  { [labelText]: '流明', value: 'LUX' },
  { [labelText]: 'PM2.5', value: 'PM25' },
  { [labelText]: '甲醛', value: 'HCHO' },
  { [labelText]: '二氧化碳', value: 'CO2' },
  { [labelText]: '当前火力档位', value: 'PZG_FIRE_GEAR' },
  { [labelText]: '当前火力档位功率', value: 'PZG_FIRE_POWER' },
  { [labelText]: '请求火力功率', value: 'PZG_REQ_POWER' },
  { [labelText]: '设定时间', value: 'PZG_SET_TIME' },
  { [labelText]: '运行时间', value: 'PZG_RUN_TIME' },
  { [labelText]: '设定温度', value: 'PZG_SET_TEMP' },
  { [labelText]: '运行温度', value: 'PZG_RUN_TEMP' },
  { [labelText]: '运行次数', value: 'PZG_RUN_COUNT' },
  { [labelText]: '电量', value: 'BATTERY' },
  { [labelText]: '上次通讯间隔时间', value: 'LAST_CONNECT' },
];

export const attributeTypeMap = (() => {
  const map = new Map<AttributeType, string>();

  map.set('ELECTRIC', '能耗');
  map.set('WORKING_HOURS', '工作时长');
  map.set('TEMPERATURE', '温度');
  map.set('HUMIDITY', '湿度');
  map.set('LUX', '流明');
  map.set('PM25', 'PM2.5');
  map.set('HCHO', '甲醛');
  map.set('CO2', '二氧化碳');
  map.set('PZG_FIRE_GEAR', '当前火力档位');
  map.set('PZG_FIRE_POWER', '当前火力档位功率');
  map.set('PZG_REQ_POWER', '请求火力功率');
  map.set('PZG_SET_TIME', '设定时间');
  map.set('PZG_RUN_TIME', '运行时间');
  map.set('PZG_SET_TEMP', '设定温度');
  map.set('PZG_RUN_TEMP', '运行温度');
  map.set('PZG_RUN_COUNT', '运行次数');

  map.set('LAST_CONNECT', '上次通讯间隔时间');
  map.set('BATTERY', '电量');

  return map;
})();

export const attributeUnitMap = (() => {
  const map = new Map<string, string>();

  map.set('ELECTRIC', 'kW·h');
  map.set('WORKING_HOURS', 'h');
  map.set('TEMPERATURE', '℃');
  map.set('HUMIDITY', '%');
  map.set('LUX', 'lux');
  map.set('PM25', 'ug/m³');
  map.set('HCHO', 'mg/m³');
  map.set('CO2', 'ppm');
  map.set('PZG_FIRE_GEAR', '');
  map.set('PZG_FIRE_POWER', 'kW');
  map.set('PZG_REQ_POWER', 'kW');
  map.set('PZG_SET_TIME', 'min');
  map.set('PZG_RUN_TIME', 'min');
  map.set('PZG_SET_TEMP', '℃');
  map.set('PZG_RUN_TEMP', '℃');
  map.set('PZG_RUN_COUNT', '次');

  return map;
})();

export const attributeColorMap = (() => {
  const map = new Map<string, string>();

  map.set('ELECTRIC', '#FCB159');
  map.set('WORKING_HOURS', '#2FC789');
  map.set('TEMPERATURE', '#FA676F');
  map.set('HUMIDITY', '#5C8AF4');
  map.set('LUX', '#F4C75F');
  map.set('PM25', '#B571CE');
  map.set('HCHO', '#3390F0');
  map.set('CO2', '#9D9DA0');
  map.set('PZG_FIRE_GEAR', '');
  map.set('PZG_FIRE_POWER', '');
  map.set('PZG_REQ_POWER', '');
  map.set('PZG_SET_TIME', '');
  map.set('PZG_RUN_TIME', '');
  map.set('PZG_SET_TEMP', '');
  map.set('PZG_RUN_TEMP', '');
  map.set('PZG_RUN_COUNT', '');

  return map;
})();
