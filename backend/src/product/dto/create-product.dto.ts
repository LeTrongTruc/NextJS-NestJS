import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsBase64, IsNumber } from "class-validator"

export class CreateProductDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly category_id: string //danh mục của sp

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly name: string //tên sp

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly detail: string //mô tả

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly specification: string //quy cách

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly standard: string //tiêu chuẩn

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly unit: string //đơn vị tính

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly quantity: string //số lượng
}