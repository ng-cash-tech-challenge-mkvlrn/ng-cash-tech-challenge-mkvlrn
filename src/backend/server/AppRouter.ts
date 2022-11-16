import express, { Response, Router } from 'express';
import { join, resolve } from 'path';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
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
    this.routes.get('/client', (_req: CustomRequest, res: Response) => {
      res.sendFile(resolve(__dirname, '..', 'client', 'index.html'));
    });
  }
}
