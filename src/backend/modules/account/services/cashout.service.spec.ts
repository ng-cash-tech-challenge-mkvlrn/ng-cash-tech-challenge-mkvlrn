import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

import { CashoutService } from '#/backend/modules/account/services/cashout.service';
import { AppError } from '#/backend/server/AppError';

describe('cashout.service.ts', () => {
  test('success', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({
              accountId: 'accountId',
              balance: 5,
              account: {},
            })
            .mockResolvedValueOnce({
              accountId: 'accountId2',
              balance: 5,
              account: {},
            }),
        },
        account: { update: jest.fn() },
        transaction: { create: jest.fn() },
        $transaction: jest.fn().mockResolvedValue([
          {},
          {},
          {
            id: 'transactionId',
            debitedAccount: 'debitedAccountId',
            creditedAccount: 'creditedAccountId',
            value: 4.2,
          },
        ]),
      }),
    );

    const { transaction } = await sut.execute(
      'debitedUsername',
      'creditedUsername',
      4.2,
    );

    expect(transaction).toEqual({
      id: 'transactionId',
      debitedAccount: 'debitedAccountId',
      creditedAccount: 'creditedAccountId',
      value: 4.2,
    });
  });

  test('fail - debited user issue', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: { findUnique: jest.fn().mockResolvedValue(null) },
      }),
    );

    const act = () => sut.execute('d', 'c', 1);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 422,
      type: 'UNPROCESSABLE',
      message: 'problem with origin account, contact support',
      details: null,
    });
  });

  test('fail - debited account issue', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: { findUnique: jest.fn().mockResolvedValue({ id: 'userId' }) },
      }),
    );

    const act = () => sut.execute('d', 'c', 1);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 422,
      type: 'UNPROCESSABLE',
      message: 'problem with origin account, contact support',
      details: null,
    });
  });

  test('fail - debited account without funds', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 'userId', account: { balance: 4 } }),
        },
      }),
    );

    const act = () => sut.execute('d', 'c', 5);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 422,
      type: 'UNPROCESSABLE',
      message: 'not enough funds to complete this transaction',
      details: null,
    });
  });

  test('fail - credited user issue', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({ id: 'userId', account: { balance: 4 } })
            .mockResolvedValueOnce(null),
        },
      }),
    );

    const act = () => sut.execute('d', 'c', 3);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 422,
      type: 'UNPROCESSABLE',
      message:
        'problem with destination account, contact the owner of that account',
      details: null,
    });
  });

  test('fail - credited account issue', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({ id: 'userId', account: { balance: 4 } })
            .mockResolvedValueOnce({ id: 'userId2' }),
        },
      }),
    );

    const act = () => sut.execute('d', 'c', 1);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 422,
      type: 'UNPROCESSABLE',
      message:
        'problem with destination account, contact the owner of that account',
      details: null,
    });
  });

  test('fail - cashout to own account', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({ id: 'userId', account: { balance: 4 } })
            .mockResolvedValueOnce({ id: 'userId', account: { balance: 4 } }),
        },
      }),
    );

    const act = () => sut.execute('d', 'c', 1);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 422,
      type: 'UNPROCESSABLE',
      message: 'cannot cashout to your own account',
      details: null,
    });
  });

  test('fail - orm/database error', async () => {
    const sut = new CashoutService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest.fn(() => {
            throw new Error('database exploded');
          }),
        },
      }),
    );

    const act = () => sut.execute('d', 'c', 1);

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'database exploded',
      details: null,
    });
  });
});
