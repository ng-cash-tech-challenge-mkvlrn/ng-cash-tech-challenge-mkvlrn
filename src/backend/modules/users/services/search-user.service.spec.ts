import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

import { SearchUserService } from '#/backend/modules/users/services/search-user.service';
import { AppError } from '#/backend/server/AppError';

describe('get-user.service.ts', () => {
  test('success', async () => {
    const sut = new SearchUserService(
      createMock<PrismaClient>({
        user: {
          findMany: jest.fn().mockResolvedValue([{ username: 'username' }]),
        },
      }),
    );

    const result = await sut.execute('username');

    expect(result).toEqual([
      {
        username: 'username',
      },
    ]);
  });

  test('fail - orm/database error', async () => {
    const sut = new SearchUserService(
      createMock<PrismaClient>({
        user: {
          findMany: jest.fn(() => {
            throw new Error('database exploded');
          }),
        },
      }),
    );

    const act = () => sut.execute('username');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'database exploded',
      details: null,
    });
  });
});
