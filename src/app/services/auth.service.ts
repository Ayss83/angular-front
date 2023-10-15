import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
} from '@angular/common/http';
import { DISABLE_INTERCEPTION, baseUrl } from '../constants';
import { User } from '../models/user.models';
import { LoginResponse, SignupResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(user: User) {
    return this.http.post<SignupResponse | { error: string }>(
      `${baseUrl}/auth/signup`,
      user,
      {
        context: new HttpContext().set(DISABLE_INTERCEPTION, true),
      }
    );
  }

  login(userCredentials: Partial<User>) {
    return this.http.post<LoginResponse | null>(
      `${baseUrl}/auth/login`,
      userCredentials,
      {
        context: new HttpContext().set(DISABLE_INTERCEPTION, true),
      }
    );
  }

  renewToken() {
    return this.http.get<LoginResponse>(`${baseUrl}/auth/token`, {
      context: new HttpContext().set(DISABLE_INTERCEPTION, true),
    });
  }
}
