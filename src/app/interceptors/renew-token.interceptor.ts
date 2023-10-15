import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { DISABLE_INTERCEPTION } from '../constants';

@Injectable()
export class RenewTokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Use of context DISABLE_INTERCEPTION property not to intercept the renewToken request
    if (this.tokenService.isTokenRenewalNeeded() && !request.context.get(DISABLE_INTERCEPTION)) {
      this.refreshToken();
    }

    return next.handle(request);
  }

  private refreshToken() {
    this.authService.renewToken().pipe(
      tap((response) => {
        this.tokenService.setToken(response.token);
      })
    ).subscribe();
  }
}
