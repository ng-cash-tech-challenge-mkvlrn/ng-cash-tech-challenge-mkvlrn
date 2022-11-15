import { createMock } from '@golevelup/ts-jest';
import express, { Application } from 'express';
import 'reflect-metadata';
import supertest from 'supertest';

import { AccountController } from '#/backend/modules/account/account.controller';
import { GetBalanceService } from '#/backend/modules/account/services/get-balance.service';

describe('auth.controller.ts', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
  });

  test('getBalance', async () => {
    const sut = new AccountController(
      createMock<GetBalanceService>({
        execute: jest.fn().mockResolvedValue({
          id: 'accountId',
          balance: 100,
        }),
      }),
    );
    app.get('/', sut.getBalance);

    const response = await supertest(app).get('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'accountId',
      balance: 100.0,
    });
  });
});
