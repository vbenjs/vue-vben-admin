interface JwtPayload {
  id: number;
  roles: string[];
  username: string;
}

export { JwtPayload };
