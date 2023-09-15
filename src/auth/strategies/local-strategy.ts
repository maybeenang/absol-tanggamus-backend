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
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nip',
    });
  }
  private readonly logger = new Logger(LocalStrategy.name);

  async validate(username: string, password: string): Promise<any> {
    // this.logger.log(`username: ${username}, password: ${password}`);
    const user = await this.authService.validateUser(username, password);
    // this.logger.log(`user: ${JSON.stringify(user)}`);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
