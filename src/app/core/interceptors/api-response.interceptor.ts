import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      // Solo interceptamos los eventos que son respuestas HTTP completas
      if (event instanceof HttpResponse) {
        const body = event.body as any;
        
        // Verificamos si la respuesta tiene la estructura de nuestro ApiResponse del backend
        // (es decir, contiene al menos 'message' y 'timestamp')
        if (body && typeof body === 'object' && 'message' in body && 'timestamp' in body) {
          // Extraemos 'data' (puede ser null para operaciones de creación/eliminación)
          // y reemplazamos el body de la respuesta
          return event.clone({ body: body.data });
        }
      }
      return event;
    })
  );
};
