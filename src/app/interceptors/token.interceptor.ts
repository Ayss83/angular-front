import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  /**
   * Retrieves the JWT token from local storage, if present, adds it to request header
   *
   * @param request original request
   * @param next 
   * @returns request clone with token in header or original request
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
      const authRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});

      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}
