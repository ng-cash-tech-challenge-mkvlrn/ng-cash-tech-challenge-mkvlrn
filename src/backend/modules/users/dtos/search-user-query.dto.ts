import { IsOptional, IsString } from 'class-validator';

export class SearchUserQueryDto {
  @IsString()
  @IsOptional()
  username?: string;
}
