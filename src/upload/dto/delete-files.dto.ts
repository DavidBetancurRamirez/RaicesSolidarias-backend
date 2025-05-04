import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DeleteFilesDto {
  @ApiProperty({ isArray: true })
  @IsArray()
  @IsString({ each: true })
  filenames: string[];
}
