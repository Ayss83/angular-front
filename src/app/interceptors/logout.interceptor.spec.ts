import { TestBed } from '@angular/core/testing';

import { LogoutInterceptor } from './logout.interceptor';

describe('LogoutInterceptor', () => {
  let service: LogoutInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
