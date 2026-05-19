import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;
        
        if (body && typeof body === 'object' && 'message' in body && 'timestamp' in body) {
          const responseData = (body.data !== null && body.data !== undefined)
            ? body.data
            : (body.id ? { id: body.id } : null);
          return event.clone({ body: responseData });
        }
      }
      return event;
    })
  );
};
