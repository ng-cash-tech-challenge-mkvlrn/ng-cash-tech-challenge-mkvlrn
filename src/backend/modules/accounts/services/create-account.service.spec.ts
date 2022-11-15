// eslint-disable-next-line import/no-extraneous-dependencies
import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

import { CreateAccountService } from '#/backend/modules/accounts/services/create-account.service';
import { AppError } from '#/backend/server/AppError';

describe('CreateAccountService.ts', () => {
  test('success', async () => {
    const sut = new CreateAccountService(
      createMock<PrismaClient>({
        account: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            username: 'username',
          }),
        },
      }),
    );

    const result = await sut.execute('userId');

    expect(result).toEqual({
      username: 'username',
    });
  });

  test('fail - username in use', async () => {
    const sut = new CreateAccountService(
      createMock<PrismaClient>({
        account: {
          findUnique: jest.fn().mockResolvedValue({
            username: 'username',
          }),
        },
      }),
    );

    const act = () => sut.execute('userId');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 409,
      type: 'CONFLICT',
      message: 'account for this user already created',
      details: null,
    });
  });

  test('fail - orm/database error', async () => {
    const sut = new CreateAccountService(
      createMock<PrismaClient>({
        account: {
          findUnique: jest.fn(() => {
            throw new Error('database exploded');
          }),
        },
      }),
    );

    const act = () => sut.execute('userId');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'database exploded',
      details: null,
    });
  });
});
