import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  /**
   * Requests the list of invoices with logged user as an owner
   *
   * @returns List of invoices for requesting user
   */
  getUserInvoices() {
    return this.http.get(`${baseUrl}/invoice`);
  }
}
