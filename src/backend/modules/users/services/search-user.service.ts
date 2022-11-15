import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { LoadedUser } from '#/backend/interfaces/LoadedUser';
import { AppError, AppErrorType } from '#/backend/server/AppError';

@injectable()
export class SearchUserService {
  constructor(private orm: PrismaClient) {}

  execute = async (input: string): Promise<LoadedUser[]> => {
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
