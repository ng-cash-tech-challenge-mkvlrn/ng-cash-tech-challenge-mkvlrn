import { Account, PrismaClient, User } from '@prisma/client';
import { hash } from 'argon2';
import { randomUUID } from 'crypto';
import { injectable } from 'tsyringe';

import { CreateUserDto } from '#/backend/modules/auth/dtos/create-user.dto';
import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class CreateUserService {
  constructor(private orm: PrismaClient) {}

  execute = async (
    input: CreateUserDto,
  ): Promise<{ account: Account; user: User }> => {
    try {
      const { username, password } = input;
      const checkUser = await this.orm.user.findUnique({ where: { username } });
      if (checkUser)
        throw new AppError(AppErrorType.CONFLICT, 'username is taken');

      const passwordHash = await hash(password);
      const accountId = randomUUID();
      const [account, user] = await this.orm.$transaction([
        this.orm.account.create({
          data: { balance: 100, id: accountId },
        }),
        this.orm.user.create({
          data: { username, password: passwordHash, accountId },
        }),
      ]);

      return { account, user };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
