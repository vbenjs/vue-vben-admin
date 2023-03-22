import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface RoleEntity extends BaseUniversalEntity {
  code: string;
  name: string;
  remark?: string;
}
