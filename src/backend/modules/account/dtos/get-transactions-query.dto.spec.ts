import { GetTransactionsQueryDto } from '#/backend/modules/account/dtos/get-transactions-query.dto';

describe('get-transactions-query.dto.ts', () => {
  test('works', () => {
    const sut = new GetTransactionsQueryDto();

    expect(sut).toBeDefined();
  });
});
