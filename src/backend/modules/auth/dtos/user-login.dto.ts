import { IsDefined } from 'class-validator';

export class UserLoginDto {
  @IsDefined()
  username!: string;

  @IsDefined()
  password!: string;
}
