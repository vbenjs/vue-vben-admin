import { Tag } from 'ant-design-vue';
import { useEnumStoreWithOut } from '../store/modules/enum';

interface Sensor {
  sensorNum: string;
  sensorType: string;
}

interface Store {
  name?: string;
  storeNumber: string;
  storeName?: string;
}

interface Gateway {
  terminalNum: string;
  terminalType: string;
  mark?: string;
}

const enumStore = useEnumStoreWithOut();

export const useFormat = () => {
  function formatSensor(sensor: Sensor, type: 'tag'): JSX.Element;
  function formatSensor(sensor: Sensor, type?: string): string;
  function formatSensor(sensor?: Sensor, type?: string) {
    if (!sensor) return '';
    if (type === '#') {
      return enumStore.sensorTypeMap.get(sensor.sensorType) + ' #' + sensor.sensorNum;
    }
    if (type === 'tag') {
      return (
        <Tag color={enumStore.sensorColorMap.get(sensor.sensorType)} class="mr-1">
          {enumStore.sensorTypeMap.get(sensor.sensorType) + ' #' + sensor.sensorNum}
        </Tag>
      );
    }

    return `${sensor.sensorNum}(${enumStore.sensorTypeMap.get(sensor.sensorType)})`;
  }

  const formatStore = (store?: Store, type?: string) => {
    if (!store) return '';
    if (type === '()') return `${store.name ?? store.storeName} (${store.storeNumber})`;
    return (store.name ?? store.storeName) + ' ' + store.storeNumber;
  };

  const formatRemindMessage = (
    message: { title: string; messageType: string },
    // type?: string,
  ) => {
    if (!message) return '';
    return message.title + `(${enumStore.messageTypeMap.get(message.messageType)})`;
  };

  const formatGateway = (gateway?: Gateway, type?: string) => {
    if (!gateway) return '';
    if (type === 'mark') return `${gateway.terminalNum}${gateway.mark ? `(${gateway.mark})` : ''}`;
    return `${gateway.terminalNum}(${
      enumStore.terminalTypeMap.get(gateway.terminalType) ?? gateway.terminalType
    })`;
  };

  const formatAttribute = (attributeType?: string, sensor?: Sensor) => {
    if (!attributeType) return '';
    if (sensor) {
      const sensorText = formatSensor(sensor, '#');
      return `${enumStore.attributeTypeMap.get(attributeType)}(${sensorText})`;
    }

    return enumStore.attributeTypeMap.get(attributeType) ?? attributeType;
  };

  return { formatSensor, formatStore, formatRemindMessage, formatGateway, formatAttribute };
};
