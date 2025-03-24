import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // This will automatically handle `created_at` and `updated_at`
export class ResetCode extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  code: string;

  // @Prop({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;

  // @Prop({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updatedAt: Date;
}

export const ResetCodeSchema = SchemaFactory.createForClass(ResetCode);
