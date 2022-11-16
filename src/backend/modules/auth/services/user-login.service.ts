import { PrismaClient } from '@prisma/client';
import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { UserLoginDto } from '#/backend/modules/auth/dtos/user-login.dto';
import { AppError, AppErrorType } from '#/backend/server/AppError';
import { Envs } from '#/backend/server/Envs';

interface AccessToken {
  ngCashAccessToken: string;
}

@injectable()
export class UserLoginService {
  constructor(private orm: PrismaClient) {}

  execute = async (input: UserLoginDto): Promise<AccessToken> => {
    try {
      const { username, password } = input;
      const user = await this.orm.user.findUnique({ where: { username } });
      if (!user)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'invalid credentials');

      const passwordMatches = await verify(user.password, password);
      if (!passwordMatches)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'invalid credentials');

      const ngCashAccessToken = sign({ sub: user.id }, Envs.JWT_SECRET, {
        expiresIn: +Envs.JWT_EXPIRATION,
      });

      return { ngCashAccessToken };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
