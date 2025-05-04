import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UploadDeliveryImagesDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @Type(() => Object)
  mainImage?: Express.Multer.File[];

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @Type(() => Object)
  tankYouImage?: Express.Multer.File[];
}
