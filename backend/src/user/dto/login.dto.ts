import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class Login {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}