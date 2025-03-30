import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop()
  refreshToken: string;

  toObject(): any {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  }
}

export const UserSchema = SchemaFactory.createForClass(User); 