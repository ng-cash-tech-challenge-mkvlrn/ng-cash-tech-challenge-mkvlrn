import { IsDefined, IsNumber, IsString, Min } from 'class-validator';

export class CashoutInputDto {
  @IsString()
  @IsDefined()
  creditedUsername!: string;

  @Min(0.01)
  @IsNumber()
  @IsDefined()
  value!: number;
}
