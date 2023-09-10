import { TestBed } from '@angular/core/testing';
import { CanActivateFn, UrlTree } from '@angular/router';

import { loggedGuard } from './logged.guard';

describe('loggedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(() => 'testToken');

    const guard = executeGuard({} as any, {} as any);

    expect(guard.valueOf()).toBeTrue();
  });

  it('should return a UrlTree', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(() => null);

    const guard = executeGuard({} as any, {} as any);

    expect(guard.valueOf()).toEqual(new UrlTree());
  });
});
