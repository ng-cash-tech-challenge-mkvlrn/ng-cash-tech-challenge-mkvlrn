import { Account, User } from '@prisma/client';

export class GetUserResponseDto {
  id!: string;

  username!: string;

  accountId!: string;

  constructor(user: User & { account: Account }) {
    this.id = user.id;
    this.username = user.username;
    this.accountId = user.accountId;
  }
}
