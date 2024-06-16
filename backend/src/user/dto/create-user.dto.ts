import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly password: string;


  @IsNotEmpty()
  @IsString()
  readonly repassword: string;

  @IsNotEmpty()
  @IsString()
  readonly otp: string;
}