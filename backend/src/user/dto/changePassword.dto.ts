import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class ChangePassword {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly newPassword: string;


  @IsNotEmpty()
  @IsString()
  readonly reNewPassword: string;
}