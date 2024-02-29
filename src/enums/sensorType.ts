const labelText = 'label';

export type SensorType =
  //DOA节点
  | 'SPM20'
  | 'SPM20B'
  | 'SPM20H'
  | 'SPM9511'
  | 'SPM9513'
  | 'SPM9513Z'
  // MultiBus节点
  | 'MULTI_NODE'
  //维嗯温湿度采集器
  | 'WM_TEMP_HUM'
  //维嗯温度采集器
  | 'WM_TEMP'
  | 'WM_LUX'
  | 'WM_PM25'
  | 'WM_HCHO'
  | 'WM_CO2'
  //测试温湿度
  | 'EDGE_TEMP_HUM'
  //
  | 'PZG_BAOZAI'
  | 'PZG_LUSHUI'
  | 'PZG_BAOWEN'
  | 'PZG_ZHUMIAN'
  | 'PZG_YOUZHA'
  | 'PZG_JIANJIAO'
  //未知传感器
  | 'UNKNOW';

export const sensorTypeOptions = [
  { [labelText]: 'SPM20', value: 'SPM20' },
  { [labelText]: 'SPM20B', value: 'SPM20B' },
  { [labelText]: 'SPM20H', value: 'SPM20H' },
  { [labelText]: 'SPM9511', value: 'SPM9511' },
  { [labelText]: 'SPM9513', value: 'SPM9513' },
  { [labelText]: 'SPM9513Z', value: 'SPM9513Z' },
  { [labelText]: 'MultiNode', value: 'MULTI_NODE' },
  { [labelText]: '温湿度', value: 'WM_TEMP_HUM' },
  { [labelText]: '温度', value: 'WM_TEMP' },
  { [labelText]: '环境光', value: 'WM_LUX' },
  { [labelText]: 'PM2.5', value: 'WM_PM25' },
  { [labelText]: '甲醛', value: 'WM_HCHO' },
  { [labelText]: '二氧化碳', value: 'WM_CO2' },
  { [labelText]: '温湿度', value: 'EDGE_TEMP_HUM' },
  { [labelText]: '煲仔炉', value: 'PZG_BAOZAI' },
  { [labelText]: '卤水炉', value: 'PZG_LUSHUI' },
  { [labelText]: '保温炉', value: 'PZG_BAOWEN' },
  { [labelText]: '煮面炉', value: 'PZG_ZHUMIAN' },
  { [labelText]: '油炸炉', value: 'PZG_YOUZHA' },
  { [labelText]: '煎饺炉', value: 'PZG_JIANJIAO' },
  { [labelText]: '未知', value: 'UNKNOW' },
];

export const sensorTypeMap = (() => {
  const map = new Map<SensorType, string>();

  map.set('SPM20', 'SPM20');
  map.set('SPM20B', 'SPM20B');
  map.set('SPM20H', 'SPM20H');
  map.set('SPM9511', 'SPM9511');
  map.set('SPM9513', 'SPM9513');
  map.set('SPM9513Z', 'SPM9513Z');
  map.set('MULTI_NODE', 'MultiNode');
  map.set('WM_TEMP_HUM', '温湿度');
  map.set('WM_TEMP', '温度');
  map.set('WM_LUX', '环境光');
  map.set('WM_PM25', 'PM2.5');
  map.set('WM_HCHO', '甲醛');
  map.set('WM_CO2', '二氧化碳');
  map.set('EDGE_TEMP_HUM', '温湿度');
  map.set('PZG_BAOZAI', '煲仔炉');
  map.set('PZG_LUSHUI', '卤水炉');
  map.set('PZG_BAOWEN', '保温炉');
  map.set('PZG_ZHUMIAN', '煮面炉');
  map.set('PZG_YOUZHA', '油炸炉');
  map.set('PZG_JIANJIAO', '煎饺炉');
  map.set('UNKNOW', '未知');

  return map;
})();

export const sensorTypeColorMap = (() => {
  const map = new Map<string, string>();

  map.set('SPM20', 'SPM20');
  map.set('SPM20B', 'SPM20B');
  map.set('SPM20H', 'SPM20H');
  map.set('SPM9511', 'SPM9511');
  map.set('SPM9513', 'SPM9513');
  map.set('SPM9513Z', 'SPM9513Z');
  map.set('MULTI_NODE', '#FCB159'); //电量
  map.set('WM_TEMP_HUM', '#5C8AF4'); //温湿度
  map.set('WM_TEMP', '#FA676F'); //温度
  map.set('WM_LUX', '#F4C75F'); //环境光
  map.set('WM_PM25', '#B571CE'); //PM2.5
  map.set('WM_HCHO', '#3390F0'); //甲醛
  map.set('WM_CO2', '#9D9DA0'); //二氧化碳
  map.set('EDGE_TEMP_HUM', '#5C8AF4'); //温湿度
  map.set('PZG_BAOZAI', '煲仔炉');
  map.set('PZG_LUSHUI', '卤水炉');
  map.set('PZG_BAOWEN', '保温炉');
  map.set('PZG_ZHUMIAN', '煮面炉');
  map.set('PZG_YOUZHA', '油炸炉');
  map.set('PZG_JIANJIAO', '煎饺炉');
  map.set('UNKNOW', '未知');

  return map;
})();
