import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenKey = 'token';

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenRenewalNeeded() {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    // Parses the token to extract the expiration time
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenPayload.exp * 1000;

    const currentTime = new Date().getTime();

    // Checks if the token is valid for less than 30 more minutes
    return expirationTime - currentTime < 30 * 60 * 1000;
  }
}
