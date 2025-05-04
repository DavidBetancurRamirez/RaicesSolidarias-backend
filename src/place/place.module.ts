import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlaceController } from './place.controller';

import { AuthModule } from '@/auth/auth.module';
import { DeliveryModule } from '@/delivery/delivery.module';

import { Place, PlaceSchema } from './place.schema';

import { PlaceService } from './place.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    AuthModule,
    DeliveryModule,
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
