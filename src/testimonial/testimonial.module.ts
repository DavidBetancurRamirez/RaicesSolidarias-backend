import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestimonialController } from './testimonial.controller';

import { AuthModule } from '@/auth/auth.module';
import { PlaceModule } from '@/place/place.module';

import { Testimonial, TestimonialSchema } from './testimonial.schema';

import { TestimonialService } from './testimonial.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Testimonial.name, schema: TestimonialSchema }]),
    AuthModule,
    forwardRef(() => PlaceModule),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
  exports: [TestimonialService],
})
export class TestimonialModule {}
