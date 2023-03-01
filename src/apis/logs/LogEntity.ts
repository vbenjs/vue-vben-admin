export default interface LogEntity {
  id: number;
  module: string;
  content: string;
  userId: number;
  isSucceeded: string;
  request: string;
  response?: string;
  error?: string;
  cost: number;
  logTime: string;
}
