import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as jsonwebtoken from 'jsonwebtoken';
import 'reflect-metadata';

import { UserLoginService } from '#/backend/modules/auth/services/user-login.service';
import { AppError } from '#/backend/server/AppError';

jest.mock('argon2', () => ({ hash: jest.fn(), verify: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

describe('user-login.service.ts', () => {
  test('success', async () => {
    const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    const signSpy = jest
      .spyOn(jsonwebtoken, 'sign')
      .mockImplementation(() => 'accessToken');
    const sut = new UserLoginService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ password: 'hashedPassword' }),
        },
      }),
    );

    const result = await sut.execute({
      username: 'username',
      password: '12345678',
    });

    expect(verifySpy).toHaveBeenCalledWith('hashedPassword', '12345678');
    expect(signSpy).toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: 'accessToken',
    });
  });

  test('fail - user not registered', async () => {
    const sut = new UserLoginService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      }),
    );

    const act = () =>
      sut.execute({
        username: 'username',
        password: '12345678',
      });

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 401,
      type: 'UNAUTHORIZED',
      message: 'invalid credentials',
      details: null,
    });
  });

  test('fail - wrong password', async () => {
    const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(false);
    const sut = new UserLoginService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest.fn().mockResolvedValue({ password: '12345678' }),
        },
      }),
    );

    const act = () =>
      sut.execute({
        username: 'username',
        password: 'wrong',
      });

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 401,
      type: 'UNAUTHORIZED',
      message: 'invalid credentials',
      details: null,
    });
    expect(verifySpy).toHaveBeenCalledWith('12345678', 'wrong');
  });

  test('fail - orm/database error', async () => {
    const sut = new UserLoginService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest.fn(() => {
            throw new Error('database exploded');
          }),
        },
      }),
    );

    const act = () =>
      sut.execute({
        username: 'username',
        password: '12345678',
      });

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 500,
      type: 'INTERNAL',
      message: 'database exploded',
      details: null,
    });
  });
});
