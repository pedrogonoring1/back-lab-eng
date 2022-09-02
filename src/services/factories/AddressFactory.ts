import { injectable } from 'inversify';

import { Address } from '../../types/IAddress';

@injectable()
export class AddressFactory {
  async call(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    cep: string
  ): Promise<Address> {
    return {
      street,
      number,
      neighborhood,
      city,
      state,
      cep,
    };
  }
}
