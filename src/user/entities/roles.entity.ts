import { Roles } from '@prisma/client';
import { UserEntity } from './user.entity';

export class RolesEntity implements Roles {
  id: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
