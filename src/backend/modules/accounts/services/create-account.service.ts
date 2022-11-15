import { Account, PrismaClient } from '@prisma/client';

import { AppError, AppErrorType } from '#/backend/server/AppError';

export class CreateAccountService {
  constructor(private orm: PrismaClient) {}

  execute = async (userId: string): Promise<Account> => {
    try {
      const account = await this.orm.account.findUnique({ where: { userId } });
      if (account)
        throw new AppError(
          AppErrorType.CONFLICT,
          'account for this user already created',
        );

      return await this.orm.account.create({ data: { balance: 100, userId } });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
