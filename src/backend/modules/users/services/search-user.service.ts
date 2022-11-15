import { Account, PrismaClient, User } from '@prisma/client';
import { injectable } from 'tsyringe';

import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class SearchUserService {
  constructor(private orm: PrismaClient) {}

  execute = async (input: string): Promise<(User & { account: Account })[]> => {
    try {
      return await this.orm.user.findMany({
        where: { username: { contains: input } },
        include: { account: true },
      });
    } catch (err) {
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
