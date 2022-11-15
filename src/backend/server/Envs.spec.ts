import { Envs } from '#/backend/server/Envs';

jest.mock('dotenv', () => ({
  config: jest.fn().mockReturnValue({ parsed: { JWT_SECRET: 'test-secret' } }),
}));

describe('Envs.ts', () => {
  test('works', () => {
    expect(Envs).toBeDefined();
    expect(Envs.JWT_SECRET).toBe('test-secret');
  });
});
