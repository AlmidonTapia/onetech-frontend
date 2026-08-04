import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { authContent } from '../../../content/shared/auth.content';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const skipHeader = 'X-Skip-Error-Handler';

  if (req.headers.has(skipHeader)) {
    return next(req.clone({ headers: req.headers.delete(skipHeader) }));
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) return throwError(() => error);
        if (error.status === 400 || error.status === 422) return throwError(() => error);

        const t = authContent.interceptors;

        if (error.status === 0) {
          messageService.add({
            severity: 'error',
            summary: t.noConnectionTitle,
            detail: t.noConnectionDetail,
            life: 6000
          });
          return throwError(() => error);
        }

        if (error.status === 403) {
          messageService.add({
            severity: 'warn',
            summary: t.accessDeniedTitle,
            detail: t.accessDeniedDetail,
            life: 5000
          });
          return throwError(() => error);
        }

        if (error.status === 404) {
          messageService.add({
            severity: 'warn',
            summary: t.notFoundTitle,
            detail: t.notFoundDetail,
            life: 5000
          });
          return throwError(() => error);
        }

        const serverMsg: string | undefined = (error.error as { message?: string })?.message;
        messageService.add({
          severity: 'error',
          summary: t.serverErrorTitle,
          detail: serverMsg ?? t.serverErrorDetail,
          life: 6000
        });
      }

      return throwError(() => error);
    })
  );
};
