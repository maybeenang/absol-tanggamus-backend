import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { RolesEnum } from '../enums/roles.enum';

export class UserEntity implements User {
  id: string;
  nama: string;
  nip: string;
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  role?: {
    role: string;
  }[];

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
