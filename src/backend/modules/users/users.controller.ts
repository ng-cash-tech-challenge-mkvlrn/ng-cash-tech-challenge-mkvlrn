import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { CreateUserDto } from '#/backend/modules/users/dtos/create-user.dto';
import { RegisterResponseDto } from '#/backend/modules/users/dtos/register-response.dto';
import { CreateUserService } from '#/backend/modules/users/services/create-user.service';
import { UserLoginService } from '#/backend/modules/users/services/user-login.service';
import { UserLogoutService } from '#/backend/modules/users/services/user-logout.service';
import { Envs } from '#/backend/server/Envs';

@injectable()
export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private userLoginService: UserLoginService,
    private userLogoutService: UserLogoutService,
  ) {}

  register = async (req: CustomRequest<CreateUserDto>, res: Response) => {
    const result = await this.createUserService.execute(req.body);

    return res.status(201).json(new RegisterResponseDto(result));
  };

  login = async (req: CustomRequest<CreateUserDto>, res: Response) => {
    const { accessToken } = await this.userLoginService.execute(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: +Envs.JWT_EXPIRATION * 1000,
    });

    return res.json({ success: true });
  };

  logout = async (req: CustomRequest<CreateUserDto>, res: Response) => {
    const token = req.cookies.accessToken;
    res.clearCookie('accessToken');
    await this.userLogoutService.execute(token);

    return res.json({ success: true });
  };

  whoami = async (req: CustomRequest<CreateUserDto>, res: Response) =>
    res.json(req.user);
}