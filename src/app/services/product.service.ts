import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../constants';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getUserProducts() {
    return this.http.get<Product[]>(`${baseUrl}/product`);
  }

  saveProduct(product: Product) {
    return this.http.post(`${baseUrl}/product`, product);
  }
}
