import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StatisticDto {
  @ApiProperty({ description: 'Meta de la estadística', example: 150, required: false })
  @IsNumber()
  @IsOptional()
  goal?: number;

  @ApiProperty({ description: 'Nombre de la estadística', example: 'Mercados' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unidad de medida de la estadística',
    example: 'kg',
    required: false,
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'Valor de la estadística', example: 100 })
  @IsNumber()
  value: number;
}
