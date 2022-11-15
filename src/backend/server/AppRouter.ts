import { Router } from 'express';
import { injectable } from 'tsyringe';

import { AuthRouter } from '#/backend/modules/auth/auth.router';
import { UsersRouter } from '#/backend/modules/users/users.router';

@injectable()
export class AppRouter {
  public routes = Router();

  constructor(
    private authRouter: AuthRouter,
    private usersRouter: UsersRouter,
  ) {
    this.routes.use('/auth', this.authRouter.routes);
    this.routes.use('/users', this.usersRouter.routes);
  }
}
