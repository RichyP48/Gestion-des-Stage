import { HttpInterceptorFn } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log(`🌐 HTTP ${req.method} Request:`, {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.keys().map(key => [key, req.headers.get(key)])),
    body: req.body,
    timestamp: new Date().toISOString()
  });

  return next(req).pipe(
    tap(response => {
      const duration = Date.now() - startTime;
      console.log(`✅ HTTP ${req.method} Success:`, {
        url: req.url,
        status: (response as any).status || 'unknown',
        duration: `${duration}ms`,
        response: response,
        timestamp: new Date().toISOString()
      });
    }),
    catchError(error => {
      const duration = Date.now() - startTime;
      console.error(`❌ HTTP ${req.method} Error:`, {
        url: req.url,
        status: error.status,
        statusText: error.statusText,
        duration: `${duration}ms`,
        error: error.error,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      return throwError(() => error);
    })
  );
};