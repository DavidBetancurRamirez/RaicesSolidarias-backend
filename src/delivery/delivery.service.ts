import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryPlacesDto } from './dto/delivery-places.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { UploadDeliveryImagesDto } from './dto/delivery-upload.dto';

import { Delivery } from './delivery.schema';

import { PlaceService } from '@/place/place.service';
import { UploadService } from '@/upload/upload.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
    private readonly placeService: PlaceService,
    private readonly uploadService: UploadService,
  ) {}

  async createOrUpdate(userId: string, createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const { id } = createDeliveryDto;

    if (id) {
      const deliveryFound = await this.findById(id);
      if (!deliveryFound) {
        throw new NotFoundException('Entrega no encontrada');
      }

      if (deliveryFound.year !== createDeliveryDto.year) {
        const existedDelivery = await this.findByYear(createDeliveryDto.year);
        if (existedDelivery) {
          throw new BadRequestException(
            `Ya existe una entrega con el año ${createDeliveryDto.year}`,
          );
        }
      }

      return (
        await this.deliveryModel
          .findByIdAndUpdate(
            id,
            { $set: { ...createDeliveryDto, updatedBy: userId } },
            { new: true, upsert: true },
          )
          .exec()
      ).toObject();
    }

    const existedDelivery = await this.findByYear(createDeliveryDto.year);
    if (existedDelivery) {
      throw new BadRequestException(`Ya existe una entrega con el año ${createDeliveryDto.year}`);
    }

    return (
      await this.deliveryModel.create({ ...createDeliveryDto, updatedBy: userId })
    ).toObject();
  }

  async findAll(): Promise<Delivery[]> {
    const deliveries = await this.deliveryModel
      .find({ deletedAt: null })
      .select(['year', 'mainMedia', 'description'])
      .sort({ year: -1 })
      .exec();

    return deliveries.map((delivery) => delivery.toObject());
  }

  async findById(id: string): Promise<Delivery | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }

    const deliveryFound = await this.deliveryModel.findOne({ _id: id, deletedAt: null }).exec();
    return deliveryFound ? deliveryFound.toObject() : null;
  }

  async findByYear(year: number, returnPlaces?: boolean): Promise<DeliveryPlacesDto | null> {
    const deliveryFound = await this.deliveryModel.findOne({ year, deletedAt: null }).exec();
    if (!returnPlaces) {
      return deliveryFound ? deliveryFound?.toObject() : null;
    }

    if (!deliveryFound || !deliveryFound._id) {
      throw new NotFoundException('Entrega no encontrada');
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const places = await this.placeService.findByDeliveryId(deliveryFound._id.toString());

    return {
      ...deliveryFound.toObject(),
      places,
    };
  }

  async softDelete(id: string): Promise<DeleteResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }
    const deletedDelivery = await this.deliveryModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();

    return { deleted: !!deletedDelivery };
  }

  async uploadMedia(
    userId: string,
    deliveryId: string,
    files: UploadDeliveryImagesDto,
  ): Promise<Delivery | null> {
    if (!isValidObjectId(deliveryId)) {
      throw new BadRequestException('El id no es válido');
    }

    const deliveryFound = await this.findById(deliveryId);
    if (!deliveryFound) {
      throw new NotFoundException('Entrega no encontrada');
    }

    if (files?.mainImage?.[0]) {
      const file = files.mainImage[0];

      const mainMedia = await this.uploadService.uploadFile({
        ...file,
        originalname: `deliveries/${deliveryFound.year}/mainImage`,
      });

      deliveryFound.mainMedia = {
        url: mainMedia.url,
        type: mainMedia.type,
      };
    }

    if (files?.tankYouMedia?.[0]) {
      const file = files.tankYouMedia[0];

      const tankYouMedia = await this.uploadService.uploadFile({
        ...file,
        originalname: `deliveries/${deliveryFound.year}/tankYouMedia`,
      });

      deliveryFound.thankYou.media = {
        url: tankYouMedia.url,
        type: tankYouMedia.type,
      };
    }

    return await this.deliveryModel
      .findByIdAndUpdate(
        deliveryId,
        { $set: { ...deliveryFound, updatedBy: userId } },
        { new: true },
      )
      .exec();
  }
}
