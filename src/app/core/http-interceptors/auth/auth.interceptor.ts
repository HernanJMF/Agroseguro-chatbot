import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  // Añade el header "Authorization" si el token está disponible
  setAuthHeader(headers: any) {
    const token = this.userService.idToken;
    if (token) {
      return headers.set("Authorization", `Bearer ${token}`);
    } else {
      return headers;
    }
  }

  // Quita los headers de control para peticiones específicas
  removeExtraControlHeaders(headers: any) {
    if (headers.has('no-auth')) headers = headers.delete('no-auth');
    if (headers.has('no-token-refresh')) headers = headers.delete('no-token-refresh');
    return headers;
  }

  // Actualiza el token en el cuerpo de la solicitud, si aplica
  updateRequestToken(request: any) {
    let body: any = request.body;
    if (body?.token) body.token = this.userService.idToken;
    return request.clone({ body: body });
  }

  // Interceptor principal
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Excluir la solicitud de inicio de sesión
    if (request.url.includes('/login')) {
      return next.handle(request);
    }

    // Añadir token para otras solicitudes
    let headers = request.headers;
    if (!headers.has('no-auth')) headers = this.setAuthHeader(headers);

    const noTokenRefresh = headers.has('no-token-refresh');
    headers = this.removeExtraControlHeaders(headers);

    return next.handle(request.clone({ headers })).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!noTokenRefresh && error.status === 401) {
          return this.userService.tokenRefresh().pipe(
            switchMap(() => {
              headers = this.setAuthHeader(headers);
              request = this.updateRequestToken(request);
              return next.handle(request.clone({ headers }));
            }),
            catchError(() => {
              this.userService.logout();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}

