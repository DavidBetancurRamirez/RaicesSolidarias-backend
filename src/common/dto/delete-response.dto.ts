import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class DeleteResponseDto {
  @ApiProperty({
    description: 'Deleted status',
  })
  @IsBoolean()
  deleted: boolean;
}
