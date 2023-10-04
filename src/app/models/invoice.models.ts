import { Customer } from "./customer.models";
import { QuantityProduct } from "./product.models";

export type Invoice = {
  _id?: string;
  num: string;
  date: Date;
  customer: Customer;
  products: QuantityProduct[];
  vatRate: number;
}

