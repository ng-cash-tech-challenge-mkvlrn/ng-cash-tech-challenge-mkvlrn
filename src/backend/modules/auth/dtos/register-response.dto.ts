import { Account, User } from '@prisma/client';

export class RegisterResponseDto {
  id!: string;

  username!: string;

  accountId!: string;

  constructor(user: User, account: Account) {
    this.id = user.id;
    this.username = user.username;
    this.accountId = account.id;
  }
}
