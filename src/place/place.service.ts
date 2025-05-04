import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Place } from './place.schema';
import { isValidObjectId, Model } from 'mongoose';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { DeliveryService } from '@/delivery/delivery.service';

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<Place>,
    private readonly deliveryService: DeliveryService,
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
}
