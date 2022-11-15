import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { CashoutInputDto } from '#/backend/modules/account/dtos/cashout-input.dto';
import { CashoutResponseDto } from '#/backend/modules/account/dtos/cashout-response.dto';
import { GetBalanceResponseDto } from '#/backend/modules/account/dtos/get-balance-response.dto';
import { GetTransactionsQueryDto } from '#/backend/modules/account/dtos/get-transactions-query.dto';
import { CashoutService } from '#/backend/modules/account/services/cashout.service';
import { GetBalanceService } from '#/backend/modules/account/services/get-balance.service';
import { GetTransactionsService } from '#/backend/modules/account/services/get-transactions.service';

@injectable()
export class AccountController {
  constructor(
    private getBalanceService: GetBalanceService,
    private cashoutService: CashoutService,
    private getTransactionsService: GetTransactionsService,
  ) {}

  getBalance = async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const result = await this.getBalanceService.execute(user?.accountId!);

    return res.json(new GetBalanceResponseDto(result));
  };

  cashOut = async (req: CustomRequest<CashoutInputDto>, res: Response) => {
    const { user, body } = req;
    const transaction = await this.cashoutService.execute(
      user?.username!,
      body.to,
      body.value,
    );

    return res.status(201).json(new CashoutResponseDto(user?.id!, transaction));
  };

  getTransactions = async (
    req: CustomRequest<any, any, keyof GetTransactionsQueryDto>,
    res: Response,
  ) => {
    const { user } = req;
    const { flow, last } = req.query;
    const result = await this.getTransactionsService.execute(
      user?.accountId!,
      flow,
      last,
    );

    return res.json(result.map((tx) => new CashoutResponseDto(user?.id!, tx)));
  };
}
