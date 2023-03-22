import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface TemplateEntity extends BaseUniversalEntity {
  name: string;
  content: string;
  groupId: number;
  remark?: string;
}
