export default interface DatabaseEntity {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  catalog?: string;
  schema?: string;
  remark?: string;
}
