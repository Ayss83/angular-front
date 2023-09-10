import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { baseUrl } from '../constants';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let httpMock: HttpTestingController;
  let service: AuthService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    })
  );

  beforeEach(() => {
    interceptor = TestBed.inject(TokenInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorization token to request header', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(() => 'testToken');

    service.login({} as any).subscribe();

    const httpReq = httpMock.expectOne(`${baseUrl}/auth/login`);
    expect(httpReq.request.headers.get('Authorization')).toBe(
      'Bearer testToken'
    );
  });

   it('should not add authorization token to request header', () => {
     spyOn(window.localStorage, 'getItem').and.callFake(() => null);

     service.login({} as any).subscribe();

     const httpReq = httpMock.expectOne(`${baseUrl}/auth/login`);
     expect(httpReq.request.headers.has('Authorization')).toBeFalse();
   });
});
