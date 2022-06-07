import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

import { RefreshToken } from './entities/refresh-token.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  private readonly logger = new Logger(this.constructor.name);
  async createRefreshToken(
    user: User,
    expiresIn: number,
  ): Promise<RefreshToken> {
    const token = new RefreshToken();

    token.userId = user.id;
    token.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + expiresIn);

    token.expires = expiration;

    try {
      await token.save();
      this.logger.debug(`Created refresh token for user ${user?.phone_number}`);
    } catch (error) {
      this.logger.error(
        `Failed to create refresh token for user ${user?.phone_number}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    return token;
  }

  async findTokenById(id: number): Promise<RefreshToken | undefined> {
    return RefreshToken.findOne({
      where: {
        id,
      },
    });
  }
}
