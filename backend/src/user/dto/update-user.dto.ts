
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateUserDto {

  @ApiProperty()
  @IsOptional()
  readonly _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly username: string;


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly sex: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly birthday: string;

  @ApiProperty()
  @IsOptional()
  readonly status: string;

  @ApiProperty()
  @IsOptional()
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  readonly avatar: string;
}