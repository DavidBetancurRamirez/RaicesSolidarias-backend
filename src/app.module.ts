import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    DeliveryModule,
    PlaceModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
