import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEntity } from 'src/user/entities/roles.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  private logger = new Logger(RoleGuard.name);

  matchRoles(roles: string[], userRoles: RolesEntity[]): boolean {
    const filter = roles?.filter(
      (role) => userRoles?.map((r) => r.role).includes(role),
    );

    return filter.length > 0;
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }
}
