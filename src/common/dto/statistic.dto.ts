import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class StatisticDto {
  @ApiProperty({ description: 'Nombre de la estadística', example: 'Total personas' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Valor de la estadística', example: 1000 })
  @IsNumber()
  value: number;
}
