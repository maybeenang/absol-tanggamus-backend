import { IsNotEmpty } from 'class-validator';

export class SignInAuthDto {
  @IsNotEmpty()
  nip: string;

  @IsNotEmpty()
  password: string;
}
