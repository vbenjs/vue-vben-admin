import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface DictionaryEntity extends BaseUniversalEntity {
  code: string;
  name: string;
  remark?: string;
}
