import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Sex {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  username: string;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  sex: Sex;

  @Prop()
  avatar: string;

  @Prop()
  birthday: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
