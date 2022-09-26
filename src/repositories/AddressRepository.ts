import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import AddressModel, { IAddressSchema } from '../models/Address';
import Settings from '../types/Settings';
import { Address } from '../types/IAddress';
// import { addressExistsError } from '../errors/errors';

@injectable()
export class AddressRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(addressInfo: Address) {
    try {
      //   const address = await AddressModel.findOne({ cpfOrCnpj: addressInfo.cep });
      //   if (address) throw addressExistsError;

      const newAddress = await AddressModel.create(addressInfo);
      await newAddress.save();

      return this.toAddressObject(newAddress);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async recuperarPorId(id: string): Promise<Address> {
    try {
      const address = await AddressModel.find({ _id: id });
      return this.toAddressObject(address[0]);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public toAddressObject(address: IAddressSchema): Address {
    return {
      id: address.id,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      cep: address.cep,
    };
  }
}
