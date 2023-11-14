import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenKey = 'token';

  /**
   * Returns authentication token from localstorage
   * 
   * @returns current JSON web token
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Saves authentication token in localstorage
   * 
   * @param token JSON web token to save
   */
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Deletes authentication token from localstorage
   */
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Checks if the authentication token needs to be renewed
   * 
   * @returns boolean indicating if renewal is needed
   */
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
