import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => this.extractJwtFromCookie(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  extractJwtFromCookie(req: any) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['gatauapaini'];
    }
    return token;
  }

  async validate(payload: any) {
    return { user: payload.sub, nip: payload.nip };
  }
}
