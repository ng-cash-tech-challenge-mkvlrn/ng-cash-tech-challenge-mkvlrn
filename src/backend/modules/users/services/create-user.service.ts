import { Account, PrismaClient, User } from '@prisma/client';
import { hash } from 'argon2';
import { injectable } from 'tsyringe';

import { CreateUserDto } from '#/backend/modules/users/dtos/create-user.dto';
import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class CreateUserService {
  constructor(private orm: PrismaClient) {}

  execute = async (
    input: CreateUserDto,
  ): Promise<{ user: User; account: Account }> => {
    try {
      const { username, password } = input;
      const user = await this.orm.user.findUnique({ where: { username } });
      if (user)
        throw new AppError(AppErrorType.CONFLICT, 'username already in use');

      const passwordHash = await hash(password);
      const newUser = await this.orm.user.create({
        data: { username, password: passwordHash },
      });
      const account = await this.orm.account.create({
        data: { balance: 100, userId: newUser.id },
      });

      return { user: newUser, account };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
