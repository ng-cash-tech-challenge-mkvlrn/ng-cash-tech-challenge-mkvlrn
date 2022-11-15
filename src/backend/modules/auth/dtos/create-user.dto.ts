import { IsAlpha, IsDefined, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Length(3, 16)
  @IsAlpha()
  @IsDefined()
  username!: string;

  @Matches(/^(?=.*\d)(?=.*[A-Z])(.{8,16})$/, {
    message:
      'password must be between 8-16 characters, contain at least one number, at least one capitalized letter, and no special symbols',
  })
  @IsDefined()
  password!: string;
}
