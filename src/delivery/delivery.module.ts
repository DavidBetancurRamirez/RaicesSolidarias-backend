import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryController } from './delivery.controller';

import { AuthModule } from '@/auth/auth.module';
import { PlaceModule } from '@/place/place.module';
import { UploadModule } from '@/upload/upload.module';

import { Delivery, DeliverySchema } from './delivery.schema';

import { DeliveryService } from './delivery.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }]),
    AuthModule,
    UploadModule,
    forwardRef(() => PlaceModule),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
