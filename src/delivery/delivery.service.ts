import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Delivery } from './delivery.schema';
import { isValidObjectId, Model } from 'mongoose';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

@Injectable()
export class DeliveryService {
  constructor(@InjectModel(Delivery.name) private deliveryModel: Model<Delivery>) {}

  async createOrUpdate(createDeliveryDto: CreateDeliveryDto, userId: string): Promise<Delivery> {
    const { id } = createDeliveryDto;

    if (id) {
      const deliveryFound = await this.findById(id);
      if (!deliveryFound) {
        throw new BadRequestException('Entrega no encontrada');
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
    const deliveries = await this.deliveryModel.find().exec();
    return deliveries.map((delivery) => delivery.toObject());
  }

  async findById(id: string): Promise<Delivery | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }
    const deliveryFound = await this.deliveryModel.findById(id).exec();
    return deliveryFound ? deliveryFound.toObject() : null;
  }

  async findByYear(year: number): Promise<Delivery | null> {
    return await this.deliveryModel.findOne({ year });
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
}
