import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import AddressModel, { IAddressSchema } from '../models/Address';
import Settings from '../types/Settings';
import { Address } from '../types/IAddress';
import { addressNotFoundError } from '../errors/errors';

@injectable()
export class AddressRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(addressInfo: Address) {
    try {
      const newAddress = await AddressModel.create(addressInfo);
      await newAddress.save();

      return this.toAddressObject(newAddress);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async find(addressId: string): Promise<Address> {
    try {
      const address = await AddressModel.findById(addressId);
      if (!address) throw addressNotFoundError;
      return this.toAddressObject(address);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async list(): Promise<Address[]> {
    try {
      const addresss = await AddressModel.find({});
      if (!addresss) throw addressNotFoundError;
      addresss.forEach((it) => this.toAddressObject(it));
      return addresss;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(addressId: string, addressInfo: Address): Promise<Address> {
    try {
      const address = await AddressModel.findByIdAndUpdate(addressId, addressInfo);
      if (!address) throw addressNotFoundError;
      return this.toAddressObject(address);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async delete(addressId: string): Promise<Address> {
    try {
      const address = await AddressModel.findByIdAndDelete(addressId);
      if (!address) throw addressNotFoundError;
      return this.toAddressObject(address);
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
