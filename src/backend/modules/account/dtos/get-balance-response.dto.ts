import { Account } from '@prisma/client';

export class GetBalanceResponseDto {
  id!: string;

  balance!: number;

  constructor(account: Account) {
    this.id = account.id;

    this.balance = +account.balance.toFixed(2);
  }
}
