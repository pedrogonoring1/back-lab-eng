export interface User {
  id?: string;
  adopter: boolean;
  adm: boolean;
  name: string;
  cpfOrCnpj: string;
  birthDate: Date;
  phone: string;
  email: string;
  password?: string;
  picture: string;
  verified: boolean;
  addressId: string;
}
