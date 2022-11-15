import { createMock } from '@golevelup/ts-jest';

import { LoadedTransaction } from '#/backend/interfaces/LoadedTransaction';
import { CashoutResponseDto } from '#/backend/modules/account/dtos/cashout-response.dto';

describe('cashout-response.dto.ts', () => {
  test('OUT flow', () => {
    const mockDate = new Date();
    const sut = new CashoutResponseDto(
      'userId',
      createMock<LoadedTransaction>({
        id: 'transactionId',
        value: 5,
        createdAt: mockDate,
        debitedAccount: { user: { id: 'userId' } },
        creditedAccount: { user: { username: 'username2' } },
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
      createMock<LoadedTransaction>({
        id: 'transactionId',
        value: 5,
        createdAt: mockDate,
        debitedAccount: { user: { id: 'userId2', username: 'username2' } },
        creditedAccount: { user: { username: 'username' } },
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
