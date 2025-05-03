import { UserRoles } from '@/common/enums/user-roles.enum';

export interface Payload {
  email: string;
  roles: UserRoles[];
  sub: string;
}
