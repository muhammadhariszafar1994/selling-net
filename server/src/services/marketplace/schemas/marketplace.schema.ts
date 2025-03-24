import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Marketplace extends Document {
  @Prop({ required: true, unique: true })
  storeMarketplace: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  clientSecret: string;

  @Prop({ required: true })
  redirectUri: string;

  @Prop({ type: Object })
  apiOAuthToken: string;
}

export const MarketplaceSchema = SchemaFactory.createForClass(Marketplace);