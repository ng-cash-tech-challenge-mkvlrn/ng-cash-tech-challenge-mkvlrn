import { Account } from '@prisma/client';

export class GetBalanceResponseDto {
  accountId!: string;

  balance!: string;

  constructor(account: Account) {
    this.accountId = account.id;

    this.balance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(+account.balance.toFixed(2));
  }
}
