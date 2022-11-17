import { IsEnum, IsOptional } from 'class-validator';

export enum Last {
  M_30 = 60 * 30,
  H_01 = 60 * 60,
  D_01 = 60 * 60 * 24,
  D_07 = 60 * 60 * 24 * 7,
  D_15 = 60 * 60 * 24 * 15,
  D_30 = 60 * 60 * 24 * 30,
  D_60 = 60 * 60 * 24 * 60,
  D_90 = 60 * 60 * 24 * 90,
}

export enum Flow {
  ALL = 'ALL',
  OUT = 'OUT',
  IN = 'IN',
}

export class GetTransactionsQueryDto {
  @IsEnum(Last, {
    message: `flow should be one of ${Object.keys(Last)
      .filter((n) => Number.isNaN(+n))
      .join(', ')}`,
  })
  @IsOptional()
  last?: Last;

  @IsEnum(Flow, {
    message: `flow should be one of ${Object.keys(Flow)
      .filter((n) => Number.isNaN(+n))
      .join(', ')}`,
  })
  @IsOptional()
  flow?: Flow;
}
