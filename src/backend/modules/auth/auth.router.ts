import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/backend/middlewares/Authentication';
import { Validation } from '#/backend/middlewares/Validation';
import { AuthController } from '#/backend/modules/auth/auth.controller';
import { CreateUserDto } from '#/backend/modules/auth/dtos/create-user.dto';

@injectable()
export class AuthRouter {
  public routes = Router();

  constructor(
    private controller: AuthController,
    private validator: Validation,
    private auth: Authentication,
  ) {
    this.routes.post(
      '/register',
      this.validator.validate(CreateUserDto),
      this.controller.register,
    );

    this.routes.post(
      '/login',
      this.validator.validate(CreateUserDto),
      this.controller.login,
    );

    this.routes.get('/whoami', this.auth.jwtStrategy, this.controller.whoami);

    this.routes.get('/logout', this.auth.jwtStrategy, this.controller.logout);
  }
}
