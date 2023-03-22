import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface DepartmentEntity extends BaseUniversalEntity {
  code: string;
  name: string;
  remark?: string;
  parentId: DepartmentEntity;
}
