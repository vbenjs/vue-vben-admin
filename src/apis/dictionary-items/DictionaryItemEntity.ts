import type BaseSystemEntity from '../BaseSystemEntity';

/**
 * 字典项数据实体
 * @export
 * @interface DictionaryItemEntity
 */
export default interface DictionaryItemEntity extends BaseSystemEntity {
  code: string;
  name: string;
  remark?: string;
  dictionaryId: number;
}
