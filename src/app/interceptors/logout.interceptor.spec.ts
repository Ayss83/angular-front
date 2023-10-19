import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { LogoutInterceptor } from './logout.interceptor';
import { TokenService } from '../services/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LogoutInterceptor', () => {
  let interceptor: LogoutInterceptor;
  let router: jasmine.SpyObj<Router>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    tokenService = jasmine.createSpyObj('TokenService', ['removeToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogoutInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LogoutInterceptor,
          multi: true,
        },
        { provide: Router, useValue: router },
        { provide: TokenService, useValue: tokenService },
      ],
    });

    interceptor = TestBed.inject(LogoutInterceptor);
    httpHandler = TestBed.inject(HttpHandler);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should handle 401 error by removing token and navigating to the root route', () => {
    const req = new HttpRequest('GET', '/some-url');
    const unauthorizedError = new HttpErrorResponse({ status: 401 });

    router.navigate.and.returnValue(Promise.resolve(true));
    tokenService.removeToken.and.returnValue(undefined);
    spyOn(httpHandler, 'handle').and.returnValue(
      throwError(() => unauthorizedError)
    );

    const result = interceptor.intercept(req, httpHandler) as Observable<any>;

    result.subscribe({
      next: () => fail('Should have thrown an error'),
      error: () => {
        expect(tokenService.removeToken).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      },
    });
  });

  it('should not modify the response for non-401 errors', () => {
    const req = new HttpRequest('GET', '/some-url');
    const someOtherError = new HttpErrorResponse({ status: 500 });

    spyOn(httpHandler, 'handle').and.returnValue(
      throwError(() => someOtherError)
    );
    tokenService.removeToken.and.returnValue(undefined);

    const result = interceptor.intercept(req, httpHandler) as Observable<any>;

    result.subscribe({
      next: () => fail('Should have received an error'),
      error: () => {
        expect(tokenService.removeToken).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      },
    });
  });
});
