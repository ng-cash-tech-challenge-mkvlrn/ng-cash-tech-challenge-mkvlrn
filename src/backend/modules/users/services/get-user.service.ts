import { Account, PrismaClient, User } from '@prisma/client';
import { injectable } from 'tsyringe';

import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class GetUserService {
  constructor(private orm: PrismaClient) {}

  execute = async (username: string): Promise<User & { account: Account }> => {
    try {
      const user = await this.orm.user.findUnique({
        where: { username },
        include: { account: true },
      });
      if (!user) throw new AppError(AppErrorType.NOT_FOUND, 'user not found');

      return user;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
