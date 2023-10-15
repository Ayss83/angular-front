import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/company.models';
import { baseUrl } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompany() {
    return this.http.get<Company>(`${baseUrl}/company`);
  }

  save(company: Company) {
    return this.http.post<Company>(`${baseUrl}/company`, company);
  }
}
