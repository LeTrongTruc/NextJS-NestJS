import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { HydratedDocument } from 'mongoose';

export type LoveProductDocument = HydratedDocument<LoveProduct>;

@Schema({
  timestamps: true,
})
export class LoveProduct {
  @Prop({ required: true })
  idUser: string;

  @Prop({ required: true })
  idProduct: string;
}

export const LoveProductSchema = SchemaFactory.createForClass(LoveProduct);
