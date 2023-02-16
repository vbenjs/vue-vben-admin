import type BaseSystemEntity from '../BaseSystemEntity';

export default interface PermissionEntity extends BaseSystemEntity {
  code: string;
  name: string;
  remark?: string;
}
