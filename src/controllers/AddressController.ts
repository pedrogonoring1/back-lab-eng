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
    this.router = express()
      .post('/create', this.create)
      .get('/list', this.list)
      .get('/find/:id', this.find)
      .put('/update/:id', this.update)
      .delete('/delete/:id', this.delete);
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

  find = async (request: Request, response: Response): Promise<void> => {
    try {
      const readedAddress = await this.addressRepository.find(request.params.id);
      response.status(201).send({ data: readedAddress });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  list = async (_: Request, response: Response): Promise<void> => {
    try {
      const listedAddresses = await this.addressRepository.list();
      response.status(201).send({ data: listedAddresses });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  update = async (request: Request, response: Response): Promise<void> => {
    try {
      const updatedAddress = await this.addressRepository.update(request.params.id, request.body);
      response.status(201).send({ data: updatedAddress });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    try {
      const deletedAddress = await this.addressRepository.delete(request.params.id);
      response.status(201).send({ data: deletedAddress });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'AddressExists') return response.status(409).send({ error: { detail: e.message } });
    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
