export type Customer = {
  _id?: string;
  num: number | null;
  lastName: string;
  firstName: string;
  email: string;
  address: Address;
  phone: string;
};

export type Address = {
  address: string;
  address2: string;
  zipCode: string;
  city: string;
};
