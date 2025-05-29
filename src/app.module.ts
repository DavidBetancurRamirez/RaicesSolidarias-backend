import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PlaceModule } from './place/place.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    DeliveryModule,
    PlaceModule,
    TestimonialModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
