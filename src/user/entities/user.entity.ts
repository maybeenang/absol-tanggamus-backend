import { User } from '@prisma/client';
import { RoleEntity } from './role.entiry';

export class UserEntity implements User {
  id: string;
  nip: string;
  nama: string;
  email: string;
  password: string;
  roles: RoleEntity[];
  createdAt: Date;
  updatedAt: Date;
}
