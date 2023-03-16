import type BaseSystemEntity from '../BaseSystemEntity';

export default interface TemplateGroupEntity extends BaseSystemEntity {
  name: string;
  remark?: string;
}
