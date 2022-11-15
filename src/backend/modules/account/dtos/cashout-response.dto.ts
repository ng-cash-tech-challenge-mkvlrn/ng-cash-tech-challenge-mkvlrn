import { LoadedTransaction } from '#/backend/interfaces/LoadedTransaction';

export class CashoutResponseDto {
  id: string;

  cashFlow: 'OUT' | 'IN';

  from?: string;

  to?: string;

  value: number;

  date: Date;

  constructor(currentUserId: string, transaction: LoadedTransaction) {
    this.id = transaction.id;
    this.value = +transaction.value;
    this.date = transaction.createdAt;

    if (currentUserId === transaction.debitedAccount.user?.id) {
      this.cashFlow = 'OUT';
      this.to = transaction.creditedAccount.user?.username;
    } else {
      this.cashFlow = 'IN';
      this.from = transaction.debitedAccount.user?.username;
    }
  }
}
