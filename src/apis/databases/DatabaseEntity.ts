import type BaseSystemEntity from '../BaseSystemEntity';

export default interface DatabaseEntity extends BaseSystemEntity {
  name: string;
  url: string;
  username: string;
  password: string;
  catalog?: string;
  schema?: string;
  remark?: string;
}
