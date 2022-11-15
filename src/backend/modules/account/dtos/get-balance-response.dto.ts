import { Account } from '@prisma/client';

export class GetBalanceResponseDto {
  id!: string;

  balance!: string;

  constructor(account: Account) {
    this.id = account.id;

    this.balance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(+account.balance.toFixed(2));
  }
}
