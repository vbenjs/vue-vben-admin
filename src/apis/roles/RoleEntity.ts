import type BaseSystemEntity from '../BaseSystemEntity';

export default interface RoleEntity extends BaseSystemEntity {
  code: string;
  name: string;
  remark?: string;
}
