interface AppConfig {
  NODE_ENV: string;
  apiPrefix: string;
  port: number;
}

interface JwtConfig {
  expiresIn: string;
  refreshSecret: string;
  refreshexpiresIn: string;
  secret: string;
}
export type { AppConfig, JwtConfig };
