import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../constants';
import { Customer } from '../models/customer.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getUserCustomers() {
    return this.http.get<Customer[]>(`${baseUrl}/customer`);
  }

  deleteCustomer(customerId: string) {
    return this.http.delete(`${baseUrl}/customer/${customerId}`);
  }

  save(customer: Customer) {
    return this.http.post(`${baseUrl}/customer`, customer);
  }
}
