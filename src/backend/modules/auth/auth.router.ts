import { Router } from 'express';
import { injectable } from 'tsyringe';

import { AuthController } from '#/backend/modules/auth/auth.controller';

@injectable()
export class AuthRouter {
  public routes = Router();

  constructor(private controller: AuthController) {
    this.routes.post('/register', this.controller.register);
  }
}
