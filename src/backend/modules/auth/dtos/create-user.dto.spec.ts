import { CreateUserDto } from '#/backend/modules/auth/dtos/create-user.dto';

describe('create-user.dto.ts', () => {
  test('works', () => {
    const sut = new CreateUserDto();

    expect(sut).toBeDefined();
  });
});
