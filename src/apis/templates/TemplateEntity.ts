import type BaseSystemEntity from '../BaseSystemEntity';

export default interface TemplateEntity extends BaseSystemEntity {
  name: string;
  content: string;
  groupId: number;
  remark?: string;
}
