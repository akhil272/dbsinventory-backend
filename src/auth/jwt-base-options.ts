import { JwtSignOptions } from '@nestjs/jwt';

export const BASE_OPTIONS: JwtSignOptions = {
  issuer: 'https://dbstyres.com',
  audience: 'https://dbstyres.com',
};
