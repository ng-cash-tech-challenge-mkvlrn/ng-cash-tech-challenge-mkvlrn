/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import cookieParser from 'cookie-parser';
import express, { Application, NextFunction, Response } from 'express';
import 'reflect-metadata';
import supertest from 'supertest';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { CreateUserService } from '#/backend/modules/users/services/create-user.service';
import { UserLoginService } from '#/backend/modules/users/services/user-login.service';
import { UserLogoutService } from '#/backend/modules/users/services/user-logout.service';
import { UsersController } from '#/backend/modules/users/users.controller';

jest.mock('dotenv', () => ({
  config: jest.fn().mockReturnValue({ parsed: { JWT_EXPIRATION: 3600 } }),
}));

describe('users.controller.ts', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
  });

  test('register', async () => {
    const sut = new UsersController(
      createMock<CreateUserService>({
        execute: jest
          .fn()
          .mockResolvedValue({ id: 'userId', username: 'username' }),
      }),
      createMock(),
      createMock(),
    );
    app.post('/', sut.register);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 'userId', username: 'username' });
  });

  test('login', async () => {
    const sut = new UsersController(
      createMock(),
      createMock<UserLoginService>({
        execute: jest.fn().mockResolvedValue({ accessToken: 'accessToken' }),
      }),
      createMock(),
    );
    app.post('/', sut.login);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers['set-cookie']).toHaveLength(1);
    expect(response.headers['set-cookie'][0]).toMatch(
      /^accessToken=accessToken; Max-Age=3600; Path=\//,
    );
  });

  test('logout', async () => {
    const sut = new UsersController(
      createMock(),
      createMock(),
      createMock<UserLogoutService>({ execute: jest.fn() }),
    );
    app.use(cookieParser());
    app.post('/', sut.logout);

    const response = await supertest(app)
      .post('/')
      .set('Cookie', ['accessToken=accessToken; Max-Age=3600; Path=/'])
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers['set-cookie']).toEqual([
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
  });

  test('whoami', async () => {
    const userMiddleware = (
      req: CustomRequest,
      _res: Response,
      next: NextFunction,
    ) => {
      req.user = { id: 'userId', username: 'username' };
      next();
    };
    const sut = new UsersController(createMock(), createMock(), createMock());
    app.post('/', userMiddleware, sut.whoami);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 'userId', username: 'username' });
  });
});
