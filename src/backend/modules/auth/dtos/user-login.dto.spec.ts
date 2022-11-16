import { UserLoginDto } from '#/backend/modules/auth/dtos/user-login.dto';

describe('user-login.dto.ts', () => {
  test('works', () => {
    const sut = new UserLoginDto();

    expect(sut).toBeDefined();
  });
});
