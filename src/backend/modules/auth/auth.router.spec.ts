/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import 'reflect-metadata';

import { AuthRouter } from '#/backend/modules/auth/auth.router';

describe('auth.router.ts', () => {
  test('works', () => {
    const sut = new AuthRouter(createMock());

    expect(sut).toBeDefined();
  });
});
