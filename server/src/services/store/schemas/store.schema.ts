import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Utility function to handle empty string values
const sanitizeNumber = (val: any) => (val === '' ? null : val);

@Schema({ timestamps: true })
export class Store extends Document {
  @Prop({ enum: ['ebay', 'amazon'], required: true })
  storeMarketplace: string;

  @Prop({ required: true })
  storeName: string;

  @Prop({ required: true })
  storeUsername: string;

  @Prop({ required: true })
  storeEmail: string;

  @Prop({ type: String, required: true }) // Store passwords as strings
  storePassword: string;

  @Prop({ type: [String], default: [] }) // Assuming supplier IDs are stored as an array of strings
  supplierIds: string[];

  @Prop({
    type: [{ supplierId: String, markUpPercent: Number }],
    default: [],
  })
  supplierMarkUps: { supplierId: string; markUpPercent: number | null }[];

  @Prop({ type: Boolean, default: false })
  syncSwitch: boolean;

  @Prop({ type: String, default: '' })
  storeRedirectUri: string;

  @Prop({ type: Number, set: sanitizeNumber, default: null })
  storeShipStationId: number | null;

  @Prop({ type: Object, default: () => ({ minQuantity: null, maxQuantity: null }) })
  storeAllowedQuantities: {
    minQuantity: number | null;
    maxQuantity: number | null;
  };

  @Prop({ type: Object, default: () => ({ accessToken: '', refreshToken: '' }) })
  apiOAuthToken: {
    accessToken: string;
    refreshToken: string;
  };

  @Prop({ type: Object, default: () => ({ isSourcingActive: false, minProfitMargin: null }) })
  sourcingSetup: {
    isSourcingActive: boolean;
    minProfitMargin: number | null;
  };

  @Prop({
    type: Object,
    default: () => ({
      optimalPricingWindow: { minimumSellerAllowedPricePercent: null, maximumSellerAllowedPricePercent: null },
      sellerId: '',
      marketplaceId: '',
      issueLocale: '',
    }),
  })
  marketplaceOptions: {
    optimalPricingWindow: {
      minimumSellerAllowedPricePercent: number | null;
      maximumSellerAllowedPricePercent: number | null;
    };
    sellerId: string;
    marketplaceId: string;
    issueLocale: string;
  };

  @Prop({
    type: Object,
    default: () => ({ ebayCommissionPercent: null, minimumProfitPercent: null }),
  })
  analyzerConfig: {
    ebayCommissionPercent: number | null;
    minimumProfitPercent: number | null;
  };

  @Prop({ type: Boolean, default: false })
  listingDescriptionTemplate: boolean;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
