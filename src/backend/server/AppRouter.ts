import express, { Router } from 'express';
import { join } from 'path';
import { injectable } from 'tsyringe';

import { AccountRouter } from '#/backend/modules/account/account.router';
import { AuthRouter } from '#/backend/modules/auth/auth.router';
import { UsersRouter } from '#/backend/modules/users/users.router';

@injectable()
export class AppRouter {
  public routes = Router();

  constructor(
    private authRouter: AuthRouter,
    private usersRouter: UsersRouter,
    private accountRouter: AccountRouter,
  ) {
    this.routes.use('/api/auth', this.authRouter.routes);
    this.routes.use('/api/users', this.usersRouter.routes);
    this.routes.use('/api/account', this.accountRouter.routes);

    this.routes.use(express.static(join(__dirname, '..', 'client')));
  }
}
