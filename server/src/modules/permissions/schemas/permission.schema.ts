import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.virtual('formattedCreatedAt').get(function () {
  return moment(this.createdAt).format('DD/MM/YYYY hh:mm:ss A');
});

PermissionSchema.virtual('formattedUpdatedAt').get(function () {
  return moment(this.updatedAt).format('DD/MM/YYYY hh:mm:ss A');
});
