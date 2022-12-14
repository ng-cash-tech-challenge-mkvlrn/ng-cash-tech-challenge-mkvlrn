import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { CreateUserDto } from '#/backend/modules/auth/dtos/create-user.dto';
import { RegisterResponseDto } from '#/backend/modules/auth/dtos/register-response.dto';
import { UserLoginDto } from '#/backend/modules/auth/dtos/user-login.dto';
import { CreateUserService } from '#/backend/modules/auth/services/create-user.service';
import { UserLoginService } from '#/backend/modules/auth/services/user-login.service';
import { UserLogoutService } from '#/backend/modules/auth/services/user-logout.service';
import { Envs } from '#/backend/server/Envs';

@injectable()
export class AuthController {
  constructor(
    private createUserService: CreateUserService,
    private userLoginService: UserLoginService,
    private userLogoutService: UserLogoutService,
  ) {}

  register = async (req: CustomRequest<CreateUserDto>, res: Response) => {
    const { user, account } = await this.createUserService.execute(req.body);
    const { ngCashAccessToken } = await this.userLoginService.execute(req.body);
    res.cookie('ngCashAccessToken', ngCashAccessToken, {
      httpOnly: true,
      maxAge: +Envs.JWT_EXPIRATION * 1000,
    });

    return res.status(201).json(new RegisterResponseDto(user, account));
  };

  login = async (req: CustomRequest<UserLoginDto>, res: Response) => {
    const { ngCashAccessToken } = await this.userLoginService.execute(req.body);
    res.cookie('ngCashAccessToken', ngCashAccessToken, {
      httpOnly: true,
      maxAge: +Envs.JWT_EXPIRATION * 1000,
    });

    return res.json({ success: true });
  };

  whoami = async (req: CustomRequest<CreateUserDto>, res: Response) =>
    res.json(req.user);

  logout = async (req: CustomRequest<CreateUserDto>, res: Response) => {
    const token = req.cookies.ngCashAccessToken;
    res.clearCookie('ngCashAccessToken');
    await this.userLogoutService.execute(token);

    return res.json({ success: true });
  };
}
