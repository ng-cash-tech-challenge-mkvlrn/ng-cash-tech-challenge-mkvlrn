import { Account, Transaction, User } from '@prisma/client';

export interface LoadedTransaction extends Transaction {
  debitedAccount: Account & {
    user: User | null;
  };
  creditedAccount: Account & {
    user: User | null;
  };
}
