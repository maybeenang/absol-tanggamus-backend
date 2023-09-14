import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  nip: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
