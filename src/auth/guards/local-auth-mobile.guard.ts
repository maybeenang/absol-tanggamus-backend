import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthMobileGuard extends AuthGuard('local-mobile') {}
