/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import express, { Application } from 'express';
import 'reflect-metadata';
import supertest from 'supertest';

import { GetUserService } from '#/backend/modules/users/services/get-user.service';
import { SearchUserService } from '#/backend/modules/users/services/search-user.service';
import { UsersController } from '#/backend/modules/users/users.controller';

jest.mock('dotenv', () => ({
  config: jest.fn().mockReturnValue({ parsed: { JWT_EXPIRATION: 3600 } }),
}));

describe('auth.controller.ts', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
  });

  test('getUser', async () => {
    const sut = new UsersController(
      createMock<GetUserService>({
        execute: jest.fn().mockResolvedValue({
          id: 'userId',
          username: 'username',
          accountId: 'accountId',
        }),
      }),
      createMock(),
    );
    app.get('/', sut.getUser);

    const response = await supertest(app).get('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'userId',
      username: 'username',
      accountId: 'accountId',
    });
  });

  test('searchUser', async () => {
    const sut = new UsersController(
      createMock(),
      createMock<SearchUserService>({
        execute: jest.fn().mockResolvedValue([
          {
            id: 'userId',
            username: 'username',
            accountId: 'accountId',
          },
        ]),
      }),
    );
    app.get('/', sut.searchUser);

    const response = await supertest(app).get('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 'userId',
        username: 'username',
        accountId: 'accountId',
      },
    ]);
  });
});
