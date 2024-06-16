import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateOTP {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsNumber()
    readonly OTP: number;
}