import { Router } from 'express';
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
    this.routes.use('/auth', this.authRouter.routes);
    this.routes.use('/users', this.usersRouter.routes);
    this.routes.use('/account', this.accountRouter.routes);
  }
}
