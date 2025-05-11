import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ResponsesSecurity } from '@/common/decorators/responses-security.decorator';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryPlacesDto } from './dto/delivery-places.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { UploadDeliveryImagesDto } from './dto/delivery-upload.dto';

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
    return this.deliveryService.createOrUpdate(userActive.sub, createDeliveryDto);
  }

  @Auth([UserRoles.ADMIN])
  @ResponsesSecurity()
  @ApiOperation({ summary: 'Upload delivery images' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'tankYouImage', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDeliveryImagesDto })
  @ApiParam({ name: 'id', description: 'ID of the delivery' })
  @Post(':id/images')
  uploadImages(
    @ActiveUser() userActive: UserActiveInterface,
    @Param('id') deliveryId: string,
    @UploadedFiles() files: UploadDeliveryImagesDto,
  ): Promise<Delivery | null> {
    return this.deliveryService.uploadImages(userActive.sub, deliveryId, files);
  }

  @ApiOperation({ summary: 'Find all deliveries' })
  @Get()
  findAll(): Promise<Delivery[]> {
    return this.deliveryService.findAll();
  }

  @ApiOperation({ summary: 'Find delivery by Year' })
  @ApiParam({ name: 'year', description: 'Year of the delivery' })
  @Get('/year/:year')
  findByYear(@Param('year') year: string): Promise<DeliveryPlacesDto | null> {
    return this.deliveryService.findByYear(+year);
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
