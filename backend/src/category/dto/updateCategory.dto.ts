import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
export class UpdateCategory {
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly parent: string;
}