import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { GetUserResponseDto } from '#/backend/modules/users/dtos/get-user-response.dto';
import { SearchUserQueryDto } from '#/backend/modules/users/dtos/search-user-query.dto';
import { GetUserService } from '#/backend/modules/users/services/get-user.service';
import { SearchUserService } from '#/backend/modules/users/services/search-user.service';

@injectable()
export class UsersController {
  constructor(
    private getUserService: GetUserService,
    private searchUserService: SearchUserService,
  ) {}

  getUser = async (req: CustomRequest, res: Response) => {
    const { username } = req.params;
    const result = await this.getUserService.execute(username);

    return res.json(new GetUserResponseDto(result));
  };

  searchUser = async (
    req: CustomRequest<any, any, keyof SearchUserQueryDto>,
    res: Response,
  ) => {
    const { username } = req.query;
    const result = await this.searchUserService.execute(username);

    return res.json(result.map((user) => new GetUserResponseDto(user)));
  };
}
