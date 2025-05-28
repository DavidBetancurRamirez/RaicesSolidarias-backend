import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Place } from '@/place/place.schema';

import { User } from '@/user/user.schema';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedAt' } })
export class Testimonial extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Place', required: true })
  place: Place | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: User | Types.ObjectId;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
