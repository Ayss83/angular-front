import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}
  
  /**
   * Retrieves the JWT token from local storage, if present, adds it to request header
   *
   * @param request original request
   * @param next 
   * @returns request clone with token in header or original request
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();

    if (token) {
      const authRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});

      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}
