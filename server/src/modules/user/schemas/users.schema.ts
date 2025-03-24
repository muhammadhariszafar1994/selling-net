import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/modules/role/schemas/roles.schema';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  phone?: string;

  @Prop({ default: null })
  address?: string;

  @Prop({ default: null })
  image?: string;

  @Prop({ default: false })
  isSuperAdmin?: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('formattedCreatedAt').get(function () {
  return moment(this.createdAt).format('DD/MM/YYYY hh:mm:ss A');
});

UserSchema.virtual('formattedUpdatedAt').get(function () {
  return moment(this.updatedAt).format('DD/MM/YYYY hh:mm:ss A');
});
