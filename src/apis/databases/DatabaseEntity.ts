import type BaseUniversalEntity from '../BaseSystemEntity';

export default interface DatabaseEntity extends BaseUniversalEntity {
  name: string;
  url: string;
  username: string;
  password: string;
  catalog?: string;
  schema?: string;
  remark?: string;
}
