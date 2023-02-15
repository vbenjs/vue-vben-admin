import type BaseSystemEntity from '../BaseSystemEntity';

export default interface DictionaryEntity extends BaseSystemEntity {
  code: string;
  name: string;
  remark?: string;
}
