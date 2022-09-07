import { Logger } from 'winston';
import { injectable, inject } from 'inversify';
import axios from 'axios';

import Settings from '../types/Settings';
import { Address } from '../types/IAddress';

@injectable()
export class AddressFetcher {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async apply(cep: string): Promise<Address> {
    try {
      const address = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      return {
        street: address.data.logradouro,
        number: address.data.complemento,
        neighborhood: address.data.bairro,
        city: address.data.localidade,
        state: address.data.uf,
        cep: address.data.cep,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
