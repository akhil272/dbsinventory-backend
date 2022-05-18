import { JwtSignOptions } from '@nestjs/jwt';

export const BASE_OPTIONS: JwtSignOptions = {
  issuer: 'https://dbs.com',
  audience: 'https://dbs.com',
};
