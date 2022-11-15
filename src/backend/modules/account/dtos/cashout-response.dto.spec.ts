import { createMock } from '@golevelup/ts-jest';
import { Account, Transaction, User } from '@prisma/client';

import { CashoutResponseDto } from '#/backend/modules/account/dtos/cashout-response.dto';

describe('cashout-response.dto.ts', () => {
  test('OUT flow', () => {
    const mockDate = new Date();
    const sut = new CashoutResponseDto(
      'userId',
      createMock<User & { account: Account }>({
        id: 'userId',
        accountId: 'accountId',
      }),
      createMock<User & { account: Account }>({
        id: 'userId2',
        username: 'username2',
        accountId: 'accountId2',
      }),
      createMock<Transaction>({
        id: 'transactionId',
        value: 5,
        createdAt: mockDate,
      }),
    );

    expect(sut).toEqual({
      id: 'transactionId',
      to: 'username2',
      cashFlow: 'OUT',
      date: mockDate,
      value: 5,
    });
  });

  test('IN flow', () => {
    const mockDate = new Date();
    const sut = new CashoutResponseDto(
      'userId',
      createMock<User & { account: Account }>({
        id: 'userId2',
        username: 'username2',
        accountId: 'accountId2',
      }),
      createMock<User & { account: Account }>({
        id: 'userId',
        accountId: 'accountId',
      }),
      createMock<Transaction>({
        id: 'transactionId',
        value: 5,
        createdAt: mockDate,
      }),
    );

    expect(sut).toEqual({
      id: 'transactionId',
      from: 'username2',
      cashFlow: 'IN',
      date: mockDate,
      value: 5,
    });
  });
});
