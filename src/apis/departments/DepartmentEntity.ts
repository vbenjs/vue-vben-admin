import type BaseSystemEntity from '../BaseSystemEntity';

export default interface DepartmentEntity extends BaseSystemEntity {
  code: string;
  name: string;
  remark?: string;
  parentId: DepartmentEntity;
}
