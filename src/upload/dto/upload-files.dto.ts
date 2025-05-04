import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  @IsArray()
  files: any[];
}
