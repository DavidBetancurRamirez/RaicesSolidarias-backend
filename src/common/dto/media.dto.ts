import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export type TypeOfMedia = 'image' | 'video' | 'other';

export class MediaDto {
  @ApiProperty({
    description: 'Type of the media file',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: TypeOfMedia;

  @ApiProperty({
    description: 'URL of the media file',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
