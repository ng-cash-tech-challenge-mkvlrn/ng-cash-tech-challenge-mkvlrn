import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { LoadedTransaction } from '#/backend/interfaces/LoadedTransaction';
import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class GetTransactionsService {
  constructor(private orm: PrismaClient) {}

  execute = async (accountId: string): Promise<LoadedTransaction[]> => {
    try {
      const result = await this.orm.transaction.findMany({
        where: {
          OR: [
            { debitedAccountId: accountId },
            { creditedAccountId: accountId },
          ],
        },
        include: {
          debitedAccount: { include: { user: true } },
          creditedAccount: { include: { user: true } },
        },
      });

      return result;
    } catch (err) {
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
