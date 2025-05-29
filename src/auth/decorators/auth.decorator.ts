import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/auth/guard/auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

import { UserRoles } from '@/common/enums/user-roles.enum';

export function Auth(roles: UserRoles[]) {
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
}
