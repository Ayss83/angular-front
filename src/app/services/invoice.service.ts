import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../constants';
import { Invoice } from '../models/invoice.models';

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
    return this.http.get<Invoice[]>(`${baseUrl}/invoice`);
  }

  saveInvoice(invoice: Invoice) {
    return this.http.post<Invoice>(`${baseUrl}/invoice`, invoice);
  }

  deleteInvoice(invoiceId: string) {
    return this.http.delete(`${baseUrl}/invoice/${invoiceId}`);
  }
}
