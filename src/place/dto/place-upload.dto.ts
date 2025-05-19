import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UploadPlaceImagesDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @Type(() => Object)
  mainImage?: Express.Multer.File[];

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @Type(() => Object)
  secondaryMedia?: Express.Multer.File[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  gallery?: Express.Multer.File[];
}
