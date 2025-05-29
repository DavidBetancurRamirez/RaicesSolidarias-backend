import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { ResponsesSecurity } from '@/common/decorators/responses-security.decorator';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { Testimonial } from './testimonial.schema';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { UserActiveInterface } from '@/common/interfaces/user.interface';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

@ResponsesSecurity()
@ApiTags('testimonial')
@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Auth([])
  @ApiOperation({ summary: 'Create or update a testimonial' })
  @Post()
  create(
    @ActiveUser() userActive: UserActiveInterface,
    @Body() createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    return this.testimonialService.createOrUpdate(createTestimonialDto, userActive.sub);
  }

  @ApiOperation({ summary: 'Find all testimonials' })
  @Get()
  findAll(): Promise<Testimonial[]> {
    return this.testimonialService.findAll();
  }

  @ApiOperation({ summary: 'Find testimonial by place ID' })
  @ApiParam({ name: 'placeId', description: 'placeId of the testimonial' })
  @Get('/place/:placeId')
  findByPlaceId(@Param('placeId') placeId: string): Promise<Testimonial[] | null> {
    return this.testimonialService.findByPlaceId(placeId);
  }

  @ApiOperation({ summary: 'Find testimonial by ID' })
  @ApiParam({ name: 'id', description: 'ID of the testimonial' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Testimonial | null> {
    return this.testimonialService.findById(id);
  }

  @Auth([])
  @ApiOperation({ summary: 'Delete a testimonial by ID' })
  @ApiParam({ name: 'id', description: 'ID of the testimonial' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.testimonialService.softDelete(id);
  }
}
