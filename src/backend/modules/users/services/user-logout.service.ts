import Redis from 'ioredis';
import { decode } from 'jsonwebtoken';

import { AppError, AppErrorType } from '#/backend/server/AppError';

export class UserLogoutService {
  constructor(private redis: Redis) {}

  // invalidates jwt, actual logout happens at controller
  execute = async (token: string): Promise<void> => {
    try {
      const decoded = decode(token) as Partial<{ exp: number }>;

      await this.redis.set(token, 'invalid', 'EXAT', decoded!.exp!);
    } catch (err) {
      throw new AppError(
        AppErrorType.INTERNAL,
        (err as Error).message,
        'invalidateJwt',
      );
    }
  };
}
