import { Address } from '../../types/IAddress';

export class TodasOngsResponse {
  id?: string;
  adopter: boolean;
  name: string;
  cpfOrCnpj: string;
  picture: string;
  verified: boolean;
  address: Address;

  constructor(params: Partial<TodasOngsResponse>) {
    this.id = params.id;
    this.adopter = params.adopter;
    this.name = params.name;
    this.cpfOrCnpj = params.cpfOrCnpj;
    this.verified = params.verified;
    this.address = params.address;
  }
}
