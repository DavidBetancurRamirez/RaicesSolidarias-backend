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

@ApiTags('place')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Auth([UserRoles.ADMIN])
  @ResponsesSecurity()
  @ApiOperation({ summary: 'Create or update a place' })
  @Post()
  create(
    @ActiveUser() userActive: UserActiveInterface,
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<Place> {
    return this.placeService.createOrUpdate(createPlaceDto, userActive.sub);
  }

  @Auth([UserRoles.ADMIN])
  @ResponsesSecurity()
  @ApiOperation({ summary: 'Upload images of a place' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'secondaryImage', maxCount: 1 },
      { name: 'gallery', maxCount: 50 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPlaceImagesDto })
  @ApiParam({ name: 'id', description: 'ID of the place' })
  @Post(':id/images')
  async uploadPlaceImages(
    @ActiveUser() userActive: UserActiveInterface,
    @Param('id') placeId: string,
    @UploadedFiles() files: UploadPlaceImagesDto,
  ): Promise<Place | null> {
    return this.placeService.uploadImages(userActive.sub, placeId, files);
  }

  @ApiOperation({ summary: 'Find all places' })
  @Get()
  findAll(): Promise<Place[]> {
    return this.placeService.findAll();
  }

  @ApiOperation({ summary: 'Find place by delivery Year' })
  @ApiParam({ name: 'year', description: 'Year of the place delivery' })
  @Get('/year/:year')
  findByYear(@Param('id') id: string): Promise<Place | null> {
    return this.placeService.findByYear(+id);
  }

  @ApiOperation({ summary: 'Find place by ID' })
  @ApiParam({ name: 'id', description: 'ID of the place' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Place | null> {
    return this.placeService.findById(id);
  }

  @ApiOperation({ summary: 'Delete a place by ID' })
  @ApiParam({ name: 'id', description: 'ID of the place' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.placeService.softDelete(id);
  }
}
