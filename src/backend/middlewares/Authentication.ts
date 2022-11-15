import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import Redis from 'ioredis';
import { verify } from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { AppError, AppErrorType } from '#/backend/server/AppError';
import { Envs } from '#/backend/server/Envs';

@injectable()
export class Authentication {
  constructor(private orm: PrismaClient, private redis: Redis) {}

  jwtStrategy = async (
    req: CustomRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    const { accessToken } = req.cookies;
    try {
      if (!accessToken)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'missing jwt token');

      const loggedout = await this.checkBlacklist(accessToken);
      if (loggedout)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'token was invalidated');

      const payload = verify(accessToken, Envs.JWT_SECRET) as {
        sub: string;
      };

      const user = await this.orm.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'invalid credentials');

      req.user = {
        id: user.id,
        username: user.username,
        accountId: user.accountId,
      };

      return next();
    } catch (err) {
      if (err instanceof AppError) return next(err);

      let errType = AppErrorType.INTERNAL;
      if ((err as Error).message.includes('jwt'))
        errType = AppErrorType.UNAUTHORIZED;
      return next(new AppError(errType, (err as Error).message));
    }
  };

  private checkBlacklist = async (token: string): Promise<boolean> => {
    try {
      const blacklisted = await this.redis.exists(token);

      return Boolean(blacklisted);
    } catch (err) {
      throw new AppError(
        AppErrorType.INTERNAL,
        (err as Error).message,
        'blacklist',
      );
    }
  };
}
