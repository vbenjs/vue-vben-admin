import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface PermissionEntity extends BaseUniversalEntity {
  code: string;
  name: string;
  remark?: string;
}
