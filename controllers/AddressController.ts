import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { AddressRepository } from '../repositories/AddressRepository';
import { AddressFactory } from '../services/factories/AddressFactory';

@injectable()
export class AddressController {
  @inject(AddressRepository)
  private addressRepository: AddressRepository;

  @inject(AddressFactory)
  private addressFactory: AddressFactory;

  router: express.Application;

  constructor() {
    this.router = express().post('/address/create', this.create);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { street, number, neighborhood, city, state, cep } = request.body;
      const address = await this.addressFactory.call(street, number, neighborhood, city, state, cep);
      const createdAddress = await this.addressRepository.create(address);
      response.status(201).send({ data: createdAddress });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'AddressExists') return response.status(409).send({ error: { detail: e.message } });
    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
