import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

import { Testimonial } from './testimonial.schema';

import { PlaceService } from '@/place/place.service';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
    @Inject(forwardRef(() => PlaceService))
    private readonly placeService: PlaceService,
  ) {}

  async createOrUpdate(
    createTestimonialDto: CreateTestimonialDto,
    userId: string,
  ): Promise<Testimonial> {
    const { id, place } = createTestimonialDto;

    const placeFound = await this.placeService.findById(place);
    if (!placeFound) {
      throw new BadRequestException('Lugar no encontrado');
    }

    if (id) {
      const testimonialFound = await this.findById(id);
      if (!testimonialFound) {
        throw new BadRequestException('Testimonio no encontrado');
      }

      return (
        await this.testimonialModel
          .findByIdAndUpdate(
            id,
            {
              $set: {
                ...createTestimonialDto,
                updatedBy: userId,
              },
            },
            { new: true, upsert: true },
          )
          .exec()
      ).toObject();
    }

    return (
      await this.testimonialModel.create({
        ...createTestimonialDto,
        createdBy: userId,
        updatedBy: userId,
      })
    ).toObject();
  }

  async findAll(): Promise<Testimonial[]> {
    const testimonials = await this.testimonialModel.find().exec();
    return testimonials.map((testimonial) => testimonial.toObject());
  }

  async findById(id: string): Promise<Testimonial | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }
    const testimonialFound = await this.testimonialModel.findById(id).exec();
    return testimonialFound ? testimonialFound.toObject() : null;
  }

  async findByPlaceId(place: string): Promise<Testimonial[] | null> {
    if (!isValidObjectId(place)) {
      throw new BadRequestException('El id no es válido');
    }
    const testimonials = await this.testimonialModel
      .find({ place, deletedAt: null })
      .populate('createdBy')
      .exec();
    return testimonials ? testimonials.map((place) => place.toObject()) : null;
  }

  async softDelete(id: string): Promise<DeleteResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }

    const deletedTestimonial = await this.testimonialModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();

    return { deleted: !!deletedTestimonial };
  }
}
