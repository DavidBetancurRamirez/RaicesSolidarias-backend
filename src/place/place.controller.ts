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

import { CreatePlaceDto } from './dto/create-place.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { UploadPlaceImagesDto } from './dto/place-upload.dto';

import { UserRoles } from '@/common/enums/user-roles.enum';

import { UserActiveInterface } from '@/common/interfaces/user.interface';

import { Place } from './place.schema';

import { PlaceService } from './place.service';
import { PlaceTestimonialsDto } from './dto/place-testimonials.dto';

@ResponsesSecurity()
@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Auth([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Create or update a place' })
  @Post()
  create(
    @ActiveUser() userActive: UserActiveInterface,
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<Place> {
    return this.placeService.createOrUpdate(createPlaceDto, userActive.sub);
  }

  @Auth([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Upload place media' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'secondaryMedia', maxCount: 1 },
      { name: 'gallery', maxCount: 50 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPlaceImagesDto })
  @ApiParam({ name: 'id', description: 'ID of the place' })
  @Post(':id/media')
  async uploadPlaceMedia(
    @ActiveUser() userActive: UserActiveInterface,
    @Param('id') placeId: string,
    @UploadedFiles() files: UploadPlaceImagesDto,
  ): Promise<Place | null> {
    return this.placeService.uploadMedia(userActive.sub, placeId, files);
  }

  @Auth([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Delete a place by ID' })
  @ApiParam({ name: 'id', description: 'ID of the place' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.placeService.softDelete(id);
  }

  @ApiOperation({ summary: 'Find all places' })
  @Get()
  findAll(): Promise<Place[]> {
    return this.placeService.findAll();
  }

  @ApiOperation({ summary: 'Find place by delivery ID' })
  @ApiParam({ name: 'deliveryId', description: 'deliveryId of the place delivery' })
  @Get('/delivery/:deliveryId')
  findByYear(@Param('deliveryId') deliveryId: string): Promise<Place[] | null> {
    return this.placeService.findByDeliveryId(deliveryId);
  }

  @ApiOperation({ summary: 'Find place by ID' })
  @ApiParam({ name: 'id', description: 'ID of the place' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PlaceTestimonialsDto | null> {
    return this.placeService.findByIdWithTestimonials(id);
  }
}
