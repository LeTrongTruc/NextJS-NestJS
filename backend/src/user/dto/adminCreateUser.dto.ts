import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class AdminCreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;


  @IsNotEmpty()
  @IsString()
  readonly username: string;
}