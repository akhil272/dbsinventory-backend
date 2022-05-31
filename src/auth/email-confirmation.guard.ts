import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import RequestWithUser from './request-with-user.interface';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.is_email_verified) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
