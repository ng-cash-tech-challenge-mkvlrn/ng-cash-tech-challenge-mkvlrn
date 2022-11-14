// eslint-disable-next-line import/no-extraneous-dependencies
import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import 'reflect-metadata';

import { CreateUserService } from '#/backend/modules/users/services/create-user.service';
import { AppError } from '#/backend/server/AppError';

jest.mock('argon2', () => ({ hash: jest.fn() }));

describe('register', () => {
  test('success', async () => {
    const hashSpy = jest.spyOn(argon2, 'hash');

    const sut = new CreateUserService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            username: 'username',
          }),
        },
      }),
    );

    const result = await sut.execute({
      username: 'username',
      password: '12345678',
    });

    expect(hashSpy).toHaveBeenCalledWith('12345678');
    expect(result).toEqual({
      username: 'username',
    });
  });

  test('fail - username in use', async () => {
    const sut = new CreateUserService(
      createMock<PrismaClient>({
        user: {
          findUnique: jest.fn().mockResolvedValue({
            username: 'uesrname',
          }),
        },
      }),
    );

    const act = () =>
      sut.execute({
        username: 'uesrname',
        password: '12345678',
      });

    await expect(act).rejects.toMatchObject<AppError>({
      name: 'AppError',
      statusCode: 409,
      type: 'CONFLICT',
      message: 'username already in use',
      details: null,
    });
  });

  test('fail - orm/database error', async () => {
    const sut = new CreateUserService(
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
        username: 'uesrname',
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