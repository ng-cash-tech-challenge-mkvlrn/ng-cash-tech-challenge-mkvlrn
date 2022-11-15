import { createMock } from '@golevelup/ts-jest';
import 'reflect-metadata';

import { Validation } from '#/backend/middlewares/Validation';
import { UsersRouter } from '#/backend/modules/users/users.router';

describe('users.router.ts', () => {
  test('works', () => {
    const sut = new UsersRouter(
      createMock(),
      createMock<Validation>({ validate: jest.fn(() => jest.fn()) }),
      createMock(),
    );

    expect(sut).toBeDefined();
  });
});
