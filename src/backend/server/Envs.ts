import { config as dotenvConfig } from 'dotenv';

const env = dotenvConfig();

export abstract class Envs {
  static DATABASE_URL: string;

  static JWT_SECRET: string;

  static JWT_EXPIRATION: number;

  static autoLoadEnv = (() => {
    Object.assign(this, env.parsed);
  })();
}