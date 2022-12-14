import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { LoadedTransaction } from '#/backend/interfaces/LoadedTransaction';
import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class CashoutService {
  constructor(private orm: PrismaClient) {}

  execute = async (
    debitedUsername: string,
    creditedUsername: string,
    value: number,
  ): Promise<LoadedTransaction> => {
    try {
      const debitedUser = await this.orm.user.findUnique({
        where: { username: debitedUsername },
        include: { account: true },
      });
      if (!debitedUser || !debitedUser.account)
        throw new AppError(
          AppErrorType.UNPROCESSABLE,
          'problem with origin account, contact support',
        );
      if (+debitedUser.account.balance < value)
        throw new AppError(
          AppErrorType.UNPROCESSABLE,
          'not enough funds to complete this transaction',
        );

      const creditedUser = await this.orm.user.findUnique({
        where: { username: creditedUsername },
        include: { account: true },
      });
      if (!creditedUser || !creditedUser.account)
        throw new AppError(
          AppErrorType.UNPROCESSABLE,
          'problem with destination account, contact the owner of that account',
        );

      if (creditedUser.accountId === debitedUser.accountId)
        throw new AppError(
          AppErrorType.UNPROCESSABLE,
          'cannot cashout to your own account',
        );

      const [_debited, _credited, transaction] = await this.orm.$transaction([
        this.orm.account.update({
          where: { id: debitedUser.accountId },
          data: { balance: +debitedUser.account.balance - value },
        }),
        this.orm.account.update({
          where: { id: creditedUser.accountId },
          data: { balance: +creditedUser.account.balance + value },
        }),
        this.orm.transaction.create({
          data: {
            debitedAccountId: debitedUser.accountId,
            creditedAccountId: creditedUser.accountId,
            value,
          },
          include: {
            debitedAccount: { include: { user: true } },
            creditedAccount: { include: { user: true } },
          },
        }),
      ]);

      return transaction;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
