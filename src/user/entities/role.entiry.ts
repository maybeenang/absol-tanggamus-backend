import { Roles } from '@prisma/client';
import { UserEntity } from './user.entity';

export class RoleEntity implements Roles {
  id: number;
  role: string;
  users: UserEntity[];
  createdAt: Date;
  updatedAt: Date;
}
