import { LoadedUser } from '#/backend/interfaces/LoadedUser';

export class GetUserResponseDto {
  id!: string;

  username!: string;

  accountId!: string;

  constructor(user: LoadedUser) {
    this.id = user.id;
    this.username = user.username;
    this.accountId = user.accountId;
  }
}
