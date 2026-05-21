import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

const pending = new Map<string, string>();

export const idempotencyInterceptor: HttpInterceptorFn = (req, next) => {
    const method = req.method?.toUpperCase();
    if (!method || (method !== 'POST' && method !== 'PATCH' && method !== 'PUT')) {
        return next(req);
    }

    const body = req.body ? JSON.stringify(req.body) : '';
    const fingerprint = req.urlWithParams + '|' + body;

    let key = pending.get(fingerprint);
    if (!key) {
        key = crypto.randomUUID();
        pending.set(fingerprint, key);
    }

    const cloned = req.clone({
        headers: req.headers.set('Idempotency-Key', key)
    });

    return next(cloned).pipe(finalize(() => pending.delete(fingerprint)));
};
