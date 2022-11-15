import { createMock } from '@golevelup/ts-jest';
import { Account } from '@prisma/client';

import { GetBalanceResponseDto } from '#/backend/modules/account/dtos/get-balance-response.dto';

describe('get-balance-response.dto.ts', () => {
  test('works', () => {
    const sut = new GetBalanceResponseDto(
      createMock<Account>({ id: 'accountId', balance: 100 }),
    );

    expect(sut).toBeDefined();
    expect(sut).toEqual({ id: 'accountId', balance: '$100.00' });
  });
});
