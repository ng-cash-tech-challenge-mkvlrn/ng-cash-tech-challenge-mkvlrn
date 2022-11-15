/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import 'reflect-metadata';

import { AppRouter } from '#/backend/server/AppRouter';

describe('AppRouter.ts', () => {
  test('works', () => {
    const sut = new AppRouter(createMock());

    expect(sut).toBeDefined();
  });
});
