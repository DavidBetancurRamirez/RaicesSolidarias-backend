import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoles } from '@/common/enums/user-roles.enum';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserActiveInterface } from '@/common/interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: UserActiveInterface }>();
    const { user } = request;

    if (user?.roles?.includes(UserRoles.ADMIN)) {
      return true;
    }

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
