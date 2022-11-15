import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Validation } from '#/backend/middlewares/Validation';
import { AuthController } from '#/backend/modules/auth/auth.controller';
import { CreateUserDto } from '#/backend/modules/auth/dtos/create-user.dto';

@injectable()
export class AuthRouter {
  public routes = Router();

  constructor(
    private controller: AuthController,
    private validator: Validation,
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
  }
}
