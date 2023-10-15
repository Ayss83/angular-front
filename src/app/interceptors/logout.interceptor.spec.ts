import { TestBed } from '@angular/core/testing';

import { LogoutInterceptor } from './logout.interceptor';

describe('LogoutInterceptor', () => {
  let interceptor: LogoutInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = TestBed.inject(LogoutInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
