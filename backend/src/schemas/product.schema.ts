import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { Document } from "mongoose";


export type ProductDocument = Product & Document;

@Schema({timestamps: true,})
export class Product extends Document{
    @Prop()
    code: string //mã sp

    @Prop()
    category_id: string //danh mục của sản phẩm

    @Prop()
    name: string //tên sp

    @Prop()
    detail: string //mô tả

    @Prop()
    specification: string //quy cách

    @Prop()
    standard: string //tiêu chuẩn

    @Prop()
    unit: string //đơn vị tính

    @Prop()
    quantity: Number //số lượng

    @Prop() 
    image: string //hình ảnh
    
    @Prop()
    note: string //ghi chú

}
export const ProductSchema = SchemaFactory.createForClass(Product);