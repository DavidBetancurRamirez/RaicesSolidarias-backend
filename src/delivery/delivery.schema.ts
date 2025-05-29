import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StatisticDto } from '../common/dto/statistic.dto';
import { ThankYouDto } from './dto/tank-you.dto';

import { User } from '@/user/user.schema';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedAt' } })
export class Delivery extends Document {
  @Prop({ required: true, unique: true })
  year: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  mainImageUrl: string;

  @Prop({
    required: false,
    type: [StatisticDto],
  })
  statistics: StatisticDto[];

  @Prop({ required: false, type: ThankYouDto })
  thankYou: ThankYouDto;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: User | Types.ObjectId;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
