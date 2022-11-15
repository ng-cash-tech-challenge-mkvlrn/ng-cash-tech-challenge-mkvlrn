import { createMock } from '@golevelup/ts-jest';
import 'reflect-metadata';

import { AccountRouter } from '#/backend/modules/account/account.router';

describe('account.router.ts', () => {
  test('works', () => {
    const sut = new AccountRouter(createMock(), createMock());

    expect(sut).toBeDefined();
  });
});
