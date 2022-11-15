import { CashoutInputDto } from '#/backend/modules/account/dtos/cashout-input.dto';

describe('cashout-input.dto.ts', () => {
  test('works', () => {
    const sut = new CashoutInputDto();

    expect(sut).toBeDefined();
  });
});
