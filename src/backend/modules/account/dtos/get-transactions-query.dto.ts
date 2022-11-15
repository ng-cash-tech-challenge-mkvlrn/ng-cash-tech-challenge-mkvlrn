import { IsEnum, IsOptional } from 'class-validator';

export enum Last {
  M_01 = 60,
  M_15 = 60 * 15,
  M_30 = 60 * 30,
  H_01 = 60 * 60,
  H_02 = 60 * 60 * 2,
  H_06 = 60 * 60 * 6,
  H_12 = 60 * 60 * 12,
  D_01 = 60 * 60 * 24,
  D_03 = 60 * 60 * 24 * 3,
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
