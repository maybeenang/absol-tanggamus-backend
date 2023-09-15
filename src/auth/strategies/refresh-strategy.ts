import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
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
    return { user: payload.sub, username: payload.username };
  }
}
