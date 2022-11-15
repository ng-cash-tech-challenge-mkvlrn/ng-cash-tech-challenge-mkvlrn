import { Account, Transaction, User } from '@prisma/client';

export class CashoutResponseDto {
  id: string;

  cashFlow: 'OUT' | 'IN';

  from?: string;

  to?: string;

  value: number;

  date: Date;

  constructor(
    currentUser: string,
    debited: User & { account: Account },
    credited: User & { account: Account },
    transaction: Transaction,
  ) {
    this.id = transaction.id;
    this.value = +transaction.value;
    this.date = transaction.createdAt;

    if (currentUser === debited.id) {
      this.cashFlow = 'OUT';
      this.to = credited.username;
    } else {
      this.cashFlow = 'IN';
      this.from = debited.username;
    }
  }
}
