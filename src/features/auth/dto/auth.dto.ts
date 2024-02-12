import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class ResendConfirmationCodeDTO {
  @IsString()
  @IsEmail()
  email: string;
}

export class VerifyAccountDTO {
  @IsString()
  @IsEmail()
  email: string;
  @Length(6, 6, { message: 'Code must be 6 characters long' })
  @IsNumberString()
  code: string;
}
