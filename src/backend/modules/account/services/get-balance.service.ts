import { Account, PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class GetBalanceService {
  constructor(private orm: PrismaClient) {}

  execute = async (id: string): Promise<Account> => {
    try {
      const result = await this.orm.account.findUnique({ where: { id } });
      if (!result)
        throw new AppError(AppErrorType.NOT_FOUND, 'account not found');

      return result;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
