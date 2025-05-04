import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ResponsesSecurity } from '@/common/decorators/responses-security.decorator';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

import { UserRoles } from '@/common/enums/user-roles.enum';

import { UserActiveInterface } from '@/common/interfaces/user.interface';

import { Delivery } from './delivery.schema';

import { DeliveryService } from './delivery.service';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Auth([UserRoles.ADMIN])
  @ResponsesSecurity()
  @ApiOperation({ summary: 'Create or update a delivery' })
  @Post()
  create(
    @ActiveUser() userActive: UserActiveInterface,
    @Body() createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    return this.deliveryService.createOrUpdate(createDeliveryDto, userActive.sub);
  }

  @ApiOperation({ summary: 'Find all deliveries' })
  @Get()
  findAll(): Promise<Delivery[]> {
    return this.deliveryService.findAll();
  }

  @ApiOperation({ summary: 'Find delivery by Year' })
  @ApiParam({ name: 'year', description: 'Year of the delivery' })
  @Get('/year/:year')
  findByYear(@Param('id') id: string): Promise<Delivery | null> {
    return this.deliveryService.findByYear(+id);
  }

  @ApiOperation({ summary: 'Find delivery by ID' })
  @ApiParam({ name: 'id', description: 'ID of the delivery' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Delivery | null> {
    return this.deliveryService.findById(id);
  }

  @ApiOperation({ summary: 'Delete a delivery by ID' })
  @ApiParam({ name: 'id', description: 'ID of the delivery' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.deliveryService.softDelete(id);
  }
}
