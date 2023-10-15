import { TestBed } from '@angular/core/testing';
import { RenewTokenInterceptor } from './renew-token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RenewTokenInterceptor', () => {
  let interceptor: RenewTokenInterceptor;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RenewTokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RenewTokenInterceptor,
          multi: true,
        },
      ],
    })
  );

  beforeEach(() => {
    interceptor = TestBed.inject(RenewTokenInterceptor);
  });
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
