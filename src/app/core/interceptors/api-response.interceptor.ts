import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;
        
        if (body && typeof body === 'object' && 'message' in body && 'timestamp' in body) {
          return event.clone({ body: body.data });
        }
      }
      return event;
    })
  );
};
