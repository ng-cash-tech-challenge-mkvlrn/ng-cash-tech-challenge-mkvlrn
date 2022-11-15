/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';

import { RegisterResponseDto } from '#/backend/modules/auth/dtos/register-response.dto';

describe('register-response.dto.ts', () => {
  test('works', () => {
    const sut = new RegisterResponseDto(createMock(), createMock());

    expect(sut).toBeDefined();
  });
});
