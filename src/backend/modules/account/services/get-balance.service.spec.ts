import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

import { GetBalanceService } from '#/backend/modules/account/services/get-balance.service';
import { AppError } from '#/backend/server/AppError';

describe('get-balance.service.ts', () => {
  test('success', async () => {
    const sut = new GetBalanceService(
      createMock<PrismaClient>({
        account: {
          findUnique: jest.fn().mockResolvedValue({ id: '123', balance: 100 }),
        },
      }),
    );

    const result = await sut.execute('123');

    expect(result).toEqual({ id: '123', balance: 100 });
  });
  test('fail - account not found', async () => {
    const sut = new GetBalanceService(
      createMock<PrismaClient>({
        account: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      }),
    );

    const act = () => sut.execute('123');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 404,
      type: 'NOT_FOUND',
      message: 'account not found',
      details: null,
    });
  });
  test('fail - orm/database error', async () => {
    const sut = new GetBalanceService(
      createMock<PrismaClient>({
        account: {
          findUnique: jest.fn(() => {
            throw new Error('database exploded');
          }),
        },
      }),
    );

    const act = () => sut.execute('123');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'database exploded',
      details: null,
    });
  });
});
