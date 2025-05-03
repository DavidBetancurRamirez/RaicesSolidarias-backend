import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserRoles } from '@/common/enums/user-roles.enum';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedAt' } })
export class User extends Document {
  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default: [UserRoles.USER],
    enum: Object.values(UserRoles),
    required: true,
    type: [String],
  })
  roles: UserRoles[];

  @Prop({ required: true })
  userName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
