import { createMock } from '@golevelup/ts-jest';

import { GetUserResponseDto } from '#/backend/modules/users/dtos/get-user-response.dto';

describe('get-user-response.dto.ts', () => {
  test('works', () => {
    const sut = new GetUserResponseDto(createMock());

    expect(sut).toBeDefined();
  });
});
