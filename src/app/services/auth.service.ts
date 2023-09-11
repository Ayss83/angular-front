import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../constants';
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
      user
    );
  }

  login(userCredentials: Partial<User>) {
    return this.http.post<LoginResponse | null>(
      `${baseUrl}/auth/login`,
      userCredentials
    );
  }
}