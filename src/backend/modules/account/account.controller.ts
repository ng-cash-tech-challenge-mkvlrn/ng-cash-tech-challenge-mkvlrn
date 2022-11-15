import { Response } from 'express';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { GetBalanceResponseDto } from '#/backend/modules/account/dtos/get-balance-response.dto';
import { GetBalanceService } from '#/backend/modules/account/services/get-balance.service';

export class AccountController {
  constructor(private getBalanceService: GetBalanceService) {}

  getBalance = async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const result = await this.getBalanceService.execute(user?.accountId!);

    return res.json(new GetBalanceResponseDto(result));
  };
}
