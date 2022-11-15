import { SearchUserQueryDto } from '#/backend/modules/users/dtos/search-user-query.dto';

describe('search-user-query.dto.ts', () => {
  test('works', () => {
    const sut = new SearchUserQueryDto();

    expect(sut).toBeDefined();
  });
});
