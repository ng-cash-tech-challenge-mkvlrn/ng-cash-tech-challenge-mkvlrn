import { createMock } from '@golevelup/ts-jest';
import express, { Application, NextFunction, Response } from 'express';
import 'reflect-metadata';
import supertest from 'supertest';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { AccountController } from '#/backend/modules/account/account.controller';
import { CashoutInputDto } from '#/backend/modules/account/dtos/cashout-input.dto';
import { CashoutService } from '#/backend/modules/account/services/cashout.service';
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
      createMock(),
    );
    app.get('/', sut.getBalance);

    const response = await supertest(app).get('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accountId: 'accountId',
      balance: 100.0,
    });
  });

  test('cashOut', async () => {
    const userMiddleware = (
      req: CustomRequest<CashoutInputDto>,
      _res: Response,
      next: NextFunction,
    ) => {
      req.user = { id: 'userId', username: 'username', accountId: 'accountId' };
      next();
    };
    const sut = new AccountController(
      createMock(),
      createMock<CashoutService>({
        execute: jest.fn().mockResolvedValue({
          debitedUser: { id: 'userId' },
          creditedUser: { username: 'creditedUsername' },
          transaction: {
            id: 'transactionId',
            debitedAccountId: 'debitedAccountId',
            creditedAccountId: 'creditedAccountId',
            value: 5,
          },
        }),
      }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.post('/', userMiddleware, sut.cashOut);

    const response = await supertest(app)
      .post('/')
      .send({ creditedUsername: 'creditedUsername', value: 5 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 'transactionId',
      cashFlow: 'OUT',
      to: '@creditedUsername',
      value: 5,
    });
  });
});
