import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/backend/middlewares/Authentication';
import { AccountController } from '#/backend/modules/account/account.controller';

@injectable()
export class AccountRouter {
  public routes = Router();

  constructor(
    private controller: AccountController,
    private auth: Authentication,
  ) {
    this.routes.use(this.auth.jwtStrategy);

    this.routes.get('/balance', this.controller.getBalance);
  }
}
