import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';

import { CreatePlaceDto } from './dto/create-place.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { UploadPlaceImagesDto } from './dto/place-upload.dto';

import { UploadedFileResponse } from '@/upload/interfaces/storage.interface';

import { Place } from './place.schema';

import { DeliveryService } from '@/delivery/delivery.service';
import { UploadService } from '@/upload/upload.service';
import { TestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<Place>,
    private readonly deliveryService: DeliveryService,
    private readonly uploadService: UploadService,
  ) {}

  async createOrUpdate(createPlaceDto: CreatePlaceDto, userId: string): Promise<Place> {
    const { id, deliveryId } = createPlaceDto;

    const deliveryFound = await this.deliveryService.findById(deliveryId);
    if (!deliveryFound) {
      throw new BadRequestException('Entrega no encontrada');
    }

    if (id) {
      const placeFound = await this.findById(id);
      if (!placeFound) {
        throw new BadRequestException('Lugar no encontrado');
      }

      return (
        await this.placeModel
          .findByIdAndUpdate(
            id,
            { $set: { ...createPlaceDto, updatedBy: userId } },
            { new: true, upsert: true },
          )
          .exec()
      ).toObject();
    }

    return (await this.placeModel.create({ ...createPlaceDto, updatedBy: userId })).toObject();
  }

  async findAll(): Promise<Place[]> {
    const places = await this.placeModel.find().exec();
    return places.map((place) => place.toObject());
  }

  async findById(id: string): Promise<Place | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }
    const placeFound = await this.placeModel.findById(id).exec();
    return placeFound ? placeFound.toObject() : null;
  }

  async findByYear(year: number): Promise<Place | null> {
    return await this.placeModel.findOne({ year });
  }

  async softDelete(id: string): Promise<DeleteResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }
    const deletedPlace = await this.placeModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();

    return { deleted: !!deletedPlace };
  }

  async testimonials(
    userId: string,
    placeId: string,
    testimonialDto: TestimonialDto,
  ): Promise<Place | null> {
    const { id } = testimonialDto;

    if (!isValidObjectId(placeId) || !isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }

    const placeFound = await this.findById(placeId);
    if (!placeFound) {
      throw new BadRequestException('Entrega no encontrada');
    }

    if (id) {
      const testimonialFound = placeFound.testimonials.find((t) => t?._id?.toString() === id);
      if (!testimonialFound) {
        throw new BadRequestException('Testimonio no encontrado');
      }

      if (testimonialDto.delete) {
        testimonialFound.deletedAt = new Date();
      } else {
        testimonialFound.testimonial = testimonialDto.testimonial;
      }
    }

    placeFound.testimonials.push({
      testimonial: testimonialDto.testimonial,
      updatedBy: new Types.ObjectId(userId),
    });

    return await this.placeModel
      .findByIdAndUpdate(placeId, { $set: placeFound }, { new: true })
      .exec();
  }

  async uploadImages(
    userId: string,
    placeId: string,
    files: UploadPlaceImagesDto,
  ): Promise<Place | null> {
    if (!isValidObjectId(placeId)) {
      throw new BadRequestException('El id no es válido');
    }

    const placeFound = await this.findById(placeId);
    if (!placeFound) {
      throw new BadRequestException('Entrega no encontrada');
    }

    const deliveryFound = await this.deliveryService.findById(placeFound.deliveryId._id as string);
    if (!deliveryFound) {
      throw new BadRequestException('Entrega no encontrada');
    }

    if (files?.mainImage?.[0]) {
      const file = files.mainImage[0];

      const mainImageUrl = await this.uploadService.uploadFile({
        ...file,
        originalname: `deliveries/${deliveryFound.year}/places/${placeId}/mainImage`,
      });

      placeFound.mainImageUrl = mainImageUrl.url;
    }

    if (files?.secondaryImage?.[0]) {
      const file = files.secondaryImage[0];

      const secondaryImageUrl = await this.uploadService.uploadFile({
        ...file,
        originalname: `deliveries/${deliveryFound.year}/places/${placeId}/secondaryImage`,
      });

      placeFound.secondaryImageUrl = secondaryImageUrl.url;
    }

    if (files?.gallery?.length) {
      const galleryImages: UploadedFileResponse[] = await this.uploadService.uploadFiles(
        files.gallery.map((file) => ({
          ...file,
          originalname: `deliveries/${deliveryFound.year}/places/${placeId}/gallery/${uuidv4()}`,
        })),
      );

      const galleryImageUrls = galleryImages.map((image) => image.url);

      placeFound.galleryImageUrls = [
        ...(placeFound.galleryImageUrls || []),
        ...(galleryImageUrls || []),
      ];
    }

    return await this.placeModel
      .findByIdAndUpdate(placeId, { $set: { ...placeFound, updatedBy: userId } }, { new: true })
      .exec();
  }
}
