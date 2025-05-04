import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryController } from './delivery.controller';

import { AuthModule } from '@/auth/auth.module';

import { Delivery, DeliverySchema } from './delivery.schema';

import { DeliveryService } from './delivery.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }]),
    AuthModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
