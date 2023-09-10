import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../constants';
import { User, UserCredentials } from '../models/user.models';
import { LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(user: User) {
    return this.http.post(`${baseUrl}/auth/signin`, user);
  }

  login(userCredentials: UserCredentials) {
    return this.http.post<LoginResponse | null>(`${baseUrl}/auth/login`, userCredentials);
  }
}
