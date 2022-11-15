import { Account, User } from '@prisma/client';

export interface LoadedUser extends User {
  account: Account;
}
