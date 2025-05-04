import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StatisticDto } from '@/common/dto/statistic.dto';
import { User } from '@/user/user.schema';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedAt' } })
export class Place extends Document {
  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'Delivery', required: true })
  deliveryId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  deliveryDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  galleryImageUrls: string[];

  @Prop({ required: true })
  mainImageUrl: string;

  @Prop({ required: true })
  placeName: string;

  @Prop({
    required: false,
    type: [StatisticDto],
  })
  statistics: StatisticDto[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: User | Types.ObjectId;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
