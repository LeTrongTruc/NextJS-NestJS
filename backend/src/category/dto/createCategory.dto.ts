import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class CreateCategory {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly parent: string;
}