import { createMock } from '@golevelup/ts-jest';
import Redis from 'ioredis';
import * as jsonwebtoken from 'jsonwebtoken';
import 'reflect-metadata';

import { UserLogoutService } from '#/backend/modules/auth/services/user-logout.service';
import { AppError } from '#/backend/server/AppError';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn(), decode: jest.fn() }));

describe('user-logout.service.ts', () => {
  test('success', async () => {
    const decodeSpy = jest
      .spyOn(jsonwebtoken, 'decode')
      .mockImplementation(() => ({ exp: 1 }));
    const mockRedis = createMock<Redis>({
      set: jest.fn(),
    });
    const sut = new UserLogoutService(mockRedis);

    await sut.execute('token');

    expect(decodeSpy).toHaveBeenCalledWith('token');
    expect(mockRedis.set).toHaveBeenCalledWith('token', 'invalid', 'EXAT', 1);
  });

  test('fail - redis broke', async () => {
    jest.spyOn(jsonwebtoken, 'decode').mockImplementation(() => ({ exp: 1 }));
    const mockRedis = createMock<Redis>({
      set: jest.fn(() => {
        throw new Error('redis broke');
      }),
    });
    const sut = new UserLogoutService(mockRedis);

    const act = () => sut.execute('token');

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'redis broke',
      details: 'invalidateJwt',
    });
  });
});
