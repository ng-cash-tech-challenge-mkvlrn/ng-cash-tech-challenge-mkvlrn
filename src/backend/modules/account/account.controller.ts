import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { CashoutInputDto } from '#/backend/modules/account/dtos/cashout-input.dto';
import { CashoutResponseDto } from '#/backend/modules/account/dtos/cashout-response.dto';
import { GetBalanceResponseDto } from '#/backend/modules/account/dtos/get-balance-response.dto';
import { CashoutService } from '#/backend/modules/account/services/cashout.service';
import { GetBalanceService } from '#/backend/modules/account/services/get-balance.service';

@injectable()
export class AccountController {
  constructor(
    private getBalanceService: GetBalanceService,
    private cashoutService: CashoutService,
  ) {}

  getBalance = async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const result = await this.getBalanceService.execute(user?.accountId!);

    return res.json(new GetBalanceResponseDto(result));
  };

  cashOut = async (req: CustomRequest<CashoutInputDto>, res: Response) => {
    const { user, body } = req;
    const { debitedUser, creditedUser, transaction } =
      await this.cashoutService.execute(user?.username!, body.to, body.value);

    return res
      .status(201)
      .json(
        new CashoutResponseDto(
          user?.id!,
          debitedUser,
          creditedUser,
          transaction,
        ),
      );
  };
}
