import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StatisticDto } from '@/common/dto/statistic.dto';

import { User } from '@/user/user.schema';
import { Delivery } from '@/delivery/delivery.schema';

@Schema()
export class Testimonial {
  _id?: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop({ required: true })
  testimonial: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: User | Types.ObjectId;
}

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedAt' } })
export class Place extends Document {
  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'Delivery', required: true })
  deliveryId: Delivery | Types.ObjectId;

  @Prop({ type: Date, required: true })
  deliveryDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: false })
  galleryImageUrls: string[];

  @Prop({ required: false })
  mainImageUrl: string;

  @Prop({ required: true })
  placeName: string;

  @Prop({ required: false })
  secondaryImageUrl: string;

  @Prop({
    required: false,
    type: [StatisticDto],
  })
  statistics: StatisticDto[];

  @Prop({ type: [Testimonial], default: [] })
  testimonials: Testimonial[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: User | Types.ObjectId;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
