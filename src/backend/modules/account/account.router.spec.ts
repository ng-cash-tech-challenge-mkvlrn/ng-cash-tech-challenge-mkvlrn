import { createMock } from '@golevelup/ts-jest';
import 'reflect-metadata';

import { Validation } from '#/backend/middlewares/Validation';
import { AccountRouter } from '#/backend/modules/account/account.router';

describe('account.router.ts', () => {
  test('works', () => {
    const sut = new AccountRouter(
      createMock(),
      createMock(),
      createMock<Validation>({ validate: jest.fn(() => jest.fn()) }),
    );

    expect(sut).toBeDefined();
  });
});
