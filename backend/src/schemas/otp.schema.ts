import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { HydratedDocument } from 'mongoose';

export type OTPDocument = HydratedDocument<OTP>;

@Schema({
    timestamps: true,
  })
export class OTP {
    @Prop({ required: true })
    OTP: number;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    expired: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);