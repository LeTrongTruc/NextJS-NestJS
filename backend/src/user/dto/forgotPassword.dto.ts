import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class ForgotPassword {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    readonly newPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly reNewPassword: string;


    @IsNotEmpty()
    @IsString()
    readonly otp: string;
}