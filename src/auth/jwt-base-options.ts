import { JwtSignOptions } from '@nestjs/jwt';

export const BASE_OPTIONS: JwtSignOptions = {
  issuer: 'https://dbsautomotive.com',
  audience: 'https://dbsautomotive.com',
};
