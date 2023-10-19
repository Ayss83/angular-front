import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpContext,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RenewTokenInterceptor } from './renew-token.interceptor';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { DISABLE_INTERCEPTION } from '../constants';

describe('RenewTokenInterceptor', () => {
  let interceptor: RenewTokenInterceptor;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['renewToken']);
    tokenService = jasmine.createSpyObj('TokenService', [
      'isTokenRenewalNeeded',
      'setToken',
    ]);
    httpHandler = {
      handle: () => new Observable<HttpEvent<any>>(),
    };

    TestBed.configureTestingModule({
      providers: [
        RenewTokenInterceptor,
        { provide: AuthService, useValue: authService },
        { provide: TokenService, useValue: tokenService },
      ],
    });

    interceptor = TestBed.inject(RenewTokenInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should renew the token if renewal is needed', () => {
    tokenService.isTokenRenewalNeeded.and.returnValue(true);
    authService.renewToken.and.returnValue(of({ token: 'newToken' }));

    const request = new HttpRequest('GET', '/api/some-resource');
    const next: HttpHandler = {
      handle: () => {
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, next).subscribe(() => {
      expect(tokenService.setToken).toHaveBeenCalledWith('newToken');
    });
  });

  it('should not renew the token if renewal is not needed', () => {
    tokenService.isTokenRenewalNeeded.and.returnValue(false);

    const request = new HttpRequest('GET', '/api/some-resource');
    const next: HttpHandler = {
      handle: () => {
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, next).subscribe(() => {
      expect(authService.renewToken).not.toHaveBeenCalled();
    });
  });

  it('should not renew the token for requests with DISABLE_INTERCEPTION header', () => {
    tokenService.isTokenRenewalNeeded.and.returnValue(true);
    authService.renewToken.and.returnValue(of({ token: 'newToken' }));

    const originalRequest = new HttpRequest('GET', '/api/some-resource');

    const request = originalRequest.clone({
      context: new HttpContext().set(DISABLE_INTERCEPTION, true),
    });

    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, next).subscribe(() => {
      expect(authService.renewToken).not.toHaveBeenCalled();
    });
  });
});
