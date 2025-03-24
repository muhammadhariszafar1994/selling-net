import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';
import * as moment from 'moment';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
  permissions: Permission[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual('formattedCreatedAt').get(function () {
  return moment(this.createdAt).format('DD/MM/YYYY hh:mm:ss A');
});

RoleSchema.virtual('formattedUpdatedAt').get(function () {
  return moment(this.updatedAt).format('DD/MM/YYYY hh:mm:ss A');
});
