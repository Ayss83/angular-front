export type Product = {
  _id?: string;
  reference: string;
  name: string;
  description: string;
  price: number | null;
}

export type QuantityProduct = {
  product: Product;
  quantity: number;
};