import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePlaceDto } from './dto/create-place.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { UploadPlaceImagesDto } from './dto/place-upload.dto';

import { UploadedFileResponse } from '@/upload/interfaces/storage.interface';

import { Place } from './place.schema';

import { DeliveryService } from '@/delivery/delivery.service';
import { TestimonialService } from '@/testimonial/testimonial.service';
import { UploadService } from '@/upload/upload.service';
import { PlaceTestimonialsDto } from './dto/place-testimonials.dto';

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<Place>,
    @Inject(forwardRef(() => DeliveryService))
    private readonly deliveryService: DeliveryService,
    // @Inject(forwardRef(() => TestimonialService))
    private readonly testimonialService: TestimonialService,
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

  async findByIdWithTestimonials(id: string): Promise<PlaceTestimonialsDto | null> {
    const placeFound = await this.findById(id);
    if (!placeFound) {
      throw new BadRequestException('Entrega no encontrada');
    }

    const testimonials = await this.testimonialService.findByPlaceId(id);
    return {
      ...placeFound,
      testimonials: testimonials || [],
    };
  }

  async findByDeliveryId(deliveryId: string): Promise<Place[] | null> {
    if (!isValidObjectId(deliveryId)) {
      throw new BadRequestException('El id no es válido');
    }

    const places = await this.placeModel
      .find({ deliveryId })
      .select(['name', 'mainImageUrl', 'deliveryDate', 'description'])
      .exec();

    return places ? places.map((place) => place.toObject()) : null;
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

  async uploadMedia(
    userId: string,
    placeId: string,
    files: UploadPlaceImagesDto,
  ): Promise<Place | null> {
    const placeFound = await this.findById(placeId);
    if (!placeFound) {
      throw new BadRequestException('Entrega no encontrada');
    }

    const deliveryFound = await this.deliveryService.findById(
      placeFound.deliveryId as unknown as string,
    );
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

    if (files?.secondaryMedia?.[0]) {
      const file = files.secondaryMedia[0];

      const secondaryMediaUrl = await this.uploadService.uploadFile({
        ...file,
        originalname: `deliveries/${deliveryFound.year}/places/${placeId}/secondaryMedia`,
      });

      placeFound.secondaryMediaUrl = secondaryMediaUrl.url;
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
