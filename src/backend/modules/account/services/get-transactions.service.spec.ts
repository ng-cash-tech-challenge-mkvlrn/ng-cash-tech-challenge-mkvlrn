import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

import { GetTransactionsService } from '#/backend/modules/account/services/get-transactions.service';
import { AppError } from '#/backend/server/AppError';

describe('get-transactions.service.ts', () => {
  test('success', async () => {
    const sut = new GetTransactionsService(
      createMock<PrismaClient>({
        transaction: { findMany: jest.fn().mockResolvedValue([]) },
      }),
    );

    const result = await sut.execute('accountId');
    const resul2 = await sut.execute('accountId', 'OUT');
    const result3 = await sut.execute('accountId', 'IN');

    expect(result).toEqual([]);
    expect(resul2).toEqual([]);
    expect(result3).toEqual([]);
  });

  test('fail - orm/database error', async () => {
    const sut = new GetTransactionsService(
      createMock<PrismaClient>({
        transaction: {
          findMany: jest.fn(() => {
            throw new Error('database exploded');
          }),
        },
      }),
    );

    const act = () => sut.execute('accountId');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'database exploded',
      details: null,
    });
  });
});
