import type BaseUniversalEntity from '../BaseSystemEntity';

/**
 * 字典项数据实体
 * @export
 * @interface DictionaryItemEntity
 */
export default interface DictionaryItemEntity extends BaseUniversalEntity {
  code: string;
  name: string;
  remark?: string;
  dictionaryId: number;
}
