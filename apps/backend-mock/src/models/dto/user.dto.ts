class CreateUserDto {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

export { CreateUserDto };
