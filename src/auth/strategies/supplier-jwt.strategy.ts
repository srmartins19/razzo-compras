import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@bidflow/types';

@Injectable()
export class SupplierJwtStrategy extends PassportStrategy(Strategy, 'supplier-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'bidflow-secret-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'supplier') return null;
    return payload;
  }
}
