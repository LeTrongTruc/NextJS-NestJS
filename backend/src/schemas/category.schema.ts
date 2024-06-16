import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
    timestamps: true,
  })
export class Category {
    @Prop()
    name: string

    @Prop()
    parent: string
}

export const CategorySchema = SchemaFactory.createForClass(Category);