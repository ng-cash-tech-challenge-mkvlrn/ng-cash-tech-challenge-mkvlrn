import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { LoadedTransaction } from '#/backend/interfaces/LoadedTransaction';
import {
  Flow,
  Last,
} from '#/backend/modules/account/dtos/get-transactions-query.dto';
import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class GetTransactionsService {
  constructor(private orm: PrismaClient) {}

  execute = async (
    accountId: string,
    flow = 'ALL',
    last = 'M_15',
  ): Promise<LoadedTransaction[]> => {
    const debitedAccountId =
      flow === Flow.ALL || flow === Flow.OUT ? accountId : undefined;
    const creditedAccountId =
      flow === Flow.ALL || flow === Flow.IN ? accountId : undefined;
    const lastInSeconds = Last[last as unknown as Last];

    const backDate = new Date(Date.now() - +lastInSeconds * 1000);

    try {
      const result = await this.orm.transaction.findMany({
        where: {
          OR: [{ debitedAccountId }, { creditedAccountId }],
          createdAt: { gte: backDate },
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
