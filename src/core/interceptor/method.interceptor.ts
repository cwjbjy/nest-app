import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  Observable,
  timeout,
  catchError,
  of,
  throwError,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class MethodInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return of('Timeout Infomation');
        }
        return throwError(() => err);
      }),
    );
  }
}
