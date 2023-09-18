import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class LocalStrategyMobile extends PassportStrategy(
  Strategy,
  'local-mobile',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nip',
    });
  }
  private readonly logger = new Logger(LocalStrategyMobile.name);

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
