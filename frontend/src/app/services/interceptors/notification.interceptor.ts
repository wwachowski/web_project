import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../notification.service';
import { inject } from '@angular/core';

export const notificationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const body = event.body as any;

          if (body?.message) {
            notificationService.show(body.message, 'message');
          }
          if (body?.error) {
            notificationService.show(body.error, 'error');
          }
          if (body?.warning) {
            notificationService.show(body.warning, 'warning');
          }
        }
      },
      error: (err) => {
        if (err?.error) {
          if (err.error?.error) {
            notificationService.show(err.error.error, 'error');
          } else if (err.error?.warning) {
            notificationService.show(err.error.warning, 'warning');
          } else if (err.message) {
            notificationService.show(err.message, 'error');
          }
        } else {
          notificationService.show('Wystąpił nieznany błąd', 'error');
        }
      },
    })
  );
};
