import { createMock } from '@golevelup/ts-jest';
import 'reflect-metadata';

import { Validation } from '#/backend/middlewares/Validation';
import { AuthRouter } from '#/backend/modules/auth/auth.router';

describe('auth.router.ts', () => {
  test('works', () => {
    const sut = new AuthRouter(
      createMock(),
      createMock<Validation>({ validate: jest.fn(() => jest.fn()) }),
    );

    expect(sut).toBeDefined();
  });
});
