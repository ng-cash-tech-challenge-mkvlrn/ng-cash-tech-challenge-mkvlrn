import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/backend/middlewares/Authentication';
import { Validation } from '#/backend/middlewares/Validation';
import { SearchUserQueryDto } from '#/backend/modules/users/dtos/search-user-query.dto';
import { UsersController } from '#/backend/modules/users/users.controller';

@injectable()
export class UsersRouter {
  public routes = Router();

  constructor(
    private controller: UsersController,
    private validator: Validation,
    private auth: Authentication,
  ) {
    this.routes.use(this.auth.jwtStrategy);

    this.routes.get('/:username', this.controller.getUser);

    this.routes.get(
      '/',
      this.validator.validate(undefined, SearchUserQueryDto),
      this.controller.searchUser,
    );
  }
}
