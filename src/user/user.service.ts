import * as bcryptjs from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createOrUpdate(createUserDto: CreateUserDto): Promise<User> {
    const { id, password } = createUserDto;

    if (password) {
      const passwordHash = await this.hashPassword(password);
      createUserDto.password = passwordHash;
    }

    if (id) {
      const userFound = await this.findById(id);
      if (!userFound) {
        throw new BadRequestException('Usuario no encontrado');
      }

      return (
        await this.userModel
          .findByIdAndUpdate(id, { $set: createUserDto }, { new: true, upsert: true })
          .exec()
      ).toObject();
    }

    const existedUser = await this.findByEmail(createUserDto.email);
    if (existedUser) {
      throw new BadRequestException('Ya existe un usuario con ese email');
    }

    return (await this.userModel.create(createUserDto)).toObject();
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find({ deletedAt: null }).exec();
    return users.map((user) => user.toObject());
  }

  async findById(id: string): Promise<User | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }

    const userFound = await this.userModel.findOne({ _id: id, deletedAt: null }).exec();
    return userFound ? userFound.toObject() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email, deletedAt: null });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }

  async softDelete(id: string): Promise<DeleteResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El id no es válido');
    }
    const deletedUser = await this.userModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();

    return { deleted: !!deletedUser };
  }
}
