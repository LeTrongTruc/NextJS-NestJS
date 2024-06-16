import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({
  timestamps: true,
})
export class Admin extends Document {
  @Prop()
  username: string;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  sex: string;

  @Prop()
  avatar: string;

  @Prop()
  position: string;

  @Prop()
  birthday: string;

  @Prop({ default: 'admin' })
  role: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
