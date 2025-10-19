import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class StatisticDto {
  @ApiProperty({ description: 'Nombre de la estadística', example: 'Mercados' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Valor de la estadística', example: 100 })
  @IsNumber()
  value: number;
}
