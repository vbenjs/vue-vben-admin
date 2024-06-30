interface User {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

interface MockDatabaseData {
  users: User[];
}

export type { MockDatabaseData, User };
