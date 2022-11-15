import { Account } from '@prisma/client';

export class GetBalanceResponseDto {
  accountId!: string;

  balance!: number;

  constructor(account: Account) {
    this.accountId = account.id;

    this.balance = +account.balance;
  }
}
