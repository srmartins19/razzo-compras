import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '@bidflow/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: process.env.JWT_SECRET || 'bidflow-dev-secret' });
  }
  async validate(payload: JwtPayload) {
    const entity = await this.authService.validateUser(payload);
    if (!entity) throw new UnauthorizedException();
    return entity;
  }
}
