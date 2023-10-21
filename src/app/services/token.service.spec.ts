import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken', () => {
    it('should return stored token value', () => {
      const tokenValue = 'testToken';
      spyOn(localStorage, 'getItem').and.returnValue(tokenValue);

      expect(service.getToken()).toBe(tokenValue);
    });
  });

  describe('setToken', () => {
    it('should store token value received as paramter', () => {
      const tokenValue = 'my-token';
      const spy = spyOn(localStorage, 'setItem');

      service.setToken(tokenValue);

      expect(spy).toHaveBeenCalledWith(jasmine.any(String), tokenValue);
    });
  });

  describe('removeToken', () => {
    it('should remove token from storage', () => {
      const spy = spyOn(localStorage, 'removeItem');

      service.removeToken();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('isTokenRenewalNeeded', () => {
    it('should return true (no stored token)', () => {
      spyOn(service, 'getToken').and.returnValue(null);

      expect(service.isTokenRenewalNeeded()).toBeTrue();
    });

    it('should return true (token expired)', () => {
      const mockToken = `header.${btoa(
        JSON.stringify({
          // adding 29 minutes and 59 seconds to current time
          exp: (Date.now() + 29 * 60 * 1000 + 59 * 1000) / 1000,
        })
      )}.signature`;
      spyOn(service, 'getToken').and.returnValue(mockToken);

      expect(service.isTokenRenewalNeeded()).toBeTrue();
    });

    it('should return false (more than 30 minutes remaining)', () => {
            const mockToken = `header.${btoa(
              JSON.stringify({
                // adding 30 minutes and 1 second to current time
                exp: (Date.now() + 30 * 60 * 1000 + 1 * 1000) / 1000,
              })
            )}.signature`;
            spyOn(service, 'getToken').and.returnValue(mockToken);

            expect(service.isTokenRenewalNeeded()).toBeFalse();
    })
  });
});
