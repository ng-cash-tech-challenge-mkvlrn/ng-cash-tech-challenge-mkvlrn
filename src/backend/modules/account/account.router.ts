import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/backend/middlewares/Authentication';
import { Validation } from '#/backend/middlewares/Validation';
import { AccountController } from '#/backend/modules/account/account.controller';
import { CashoutInputDto } from '#/backend/modules/account/dtos/cashout-input.dto';

@injectable()
export class AccountRouter {
  public routes = Router();

  constructor(
    private controller: AccountController,
    private auth: Authentication,
    private validator: Validation,
  ) {
    this.routes.use(this.auth.jwtStrategy);

    this.routes.get('/balance', this.controller.getBalance);

    this.routes.post(
      '/cashout',
      this.validator.validate(CashoutInputDto),
      this.controller.cashOut,
    );
  }
}
