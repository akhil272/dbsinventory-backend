import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/utils/types/common';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return response;
        } else {
          const { success, message, data, ...rest } = response;
          return {
            success: success ?? true,
            status: context.switchToHttp().getResponse().statusCode,
            message: message,
            data: data ?? rest,
          };
        }
      }),
    );
  }
}
