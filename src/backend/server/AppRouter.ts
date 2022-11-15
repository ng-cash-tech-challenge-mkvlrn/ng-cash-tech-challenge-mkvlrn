import { Router } from 'express';
import { injectable } from 'tsyringe';

import { AuthRouter } from '#/backend/modules/auth/auth.router';

@injectable()
export class AppRouter {
  public routes = Router();

  constructor(private authRouter: AuthRouter) {
    this.routes.use('/auth', this.authRouter.routes);
  }
}
