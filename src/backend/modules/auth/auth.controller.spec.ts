import { createMock } from '@golevelup/ts-jest';
import cookieParser from 'cookie-parser';
import express, { Application, NextFunction, Response } from 'express';
import 'reflect-metadata';
import supertest from 'supertest';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { AuthController } from '#/backend/modules/auth/auth.controller';
import { CreateUserService } from '#/backend/modules/auth/services/create-user.service';
import { UserLoginService } from '#/backend/modules/auth/services/user-login.service';
import { UserLogoutService } from '#/backend/modules/auth/services/user-logout.service';

jest.mock('dotenv', () => ({
  config: jest.fn().mockReturnValue({ parsed: { JWT_EXPIRATION: 3600 } }),
}));

describe('auth.controller.ts', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
  });

  test('register', async () => {
    const sut = new AuthController(
      createMock<CreateUserService>({
        execute: jest.fn().mockResolvedValue({
          user: { id: 'userId', username: 'username' },
          account: { id: 'accountId', userId: 'userId', balance: 100.0 },
        }),
      }),
      createMock(),
      createMock(),
    );
    app.post('/', sut.register);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 'userId',
      username: 'username',
      accountId: 'accountId',
    });
  });

  test('login', async () => {
    const sut = new AuthController(
      createMock(),
      createMock<UserLoginService>({
        execute: jest
          .fn()
          .mockResolvedValue({ ngCashAccessToken: 'ngCashAccessToken' }),
      }),
      createMock(),
    );
    app.post('/', sut.login);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers['set-cookie']).toHaveLength(1);
    expect(response.headers['set-cookie'][0]).toMatch(
      /^ngCashAccessToken=ngCashAccessToken; Max-Age=3600; Path=\//,
    );
  });

  test('logout', async () => {
    const sut = new AuthController(
      createMock(),
      createMock(),
      createMock<UserLogoutService>({ execute: jest.fn() }),
    );
    app.use(cookieParser());
    app.post('/', sut.logout);

    const response = await supertest(app)
      .post('/')
      .set('Cookie', [
        'ngCashAccessToken=ngCashAccessToken; Max-Age=3600; Path=/',
      ])
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers['set-cookie']).toEqual([
      'ngCashAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
  });

  test('whoami', async () => {
    const userMiddleware = (
      req: CustomRequest,
      _res: Response,
      next: NextFunction,
    ) => {
      req.user = { id: 'userId', username: 'username', accountId: 'accountId' };
      next();
    };
    const sut = new AuthController(createMock(), createMock(), createMock());
    app.post('/', userMiddleware, sut.whoami);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'userId',
      username: 'username',
      accountId: 'accountId',
    });
  });
});
