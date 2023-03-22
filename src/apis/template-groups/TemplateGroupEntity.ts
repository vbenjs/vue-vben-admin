import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface TemplateGroupEntity extends BaseUniversalEntity {
  name: string;
  remark?: string;
}
