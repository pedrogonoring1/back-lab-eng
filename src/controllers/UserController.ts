import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { UserRepository } from '../repositories/UserRepository';
import { UserFactory } from '../services/factories/UserFactory';

import { AddressRepository } from '../repositories/AddressRepository';
import { AddressFactory } from '../services/factories/AddressFactory';

@injectable()
export class UserController {
  @inject(UserRepository)
  private userRepository: UserRepository;

  @inject(UserFactory)
  private userFactory: UserFactory;

  @inject(AddressRepository)
  private addressRepository: AddressRepository;

  @inject(AddressFactory)
  private addressFactory: AddressFactory;

  constructor() {
    this.create = this.create.bind(this);
    this.addressRepository = new AddressRepository();
    this.userRepository = new UserRepository();
    this.addressFactory = new AddressFactory();
    this.userFactory = new UserFactory();
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this)
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { street, number, neighborhood, city, state, cep } = request.body.address;
      const address = await this.addressFactory.call(
        street, 
        number, 
        neighborhood, 
        city, 
        state, 
        cep
      );
      const createdAddress = await this.addressRepository.create(address);
      var addressId = createdAddress.id;      

      const { adopter, adm, name, cpfOrCnpj, birthDate, phone, email, password, picture, verification } = request.body.user;
      const user = await this.userFactory.call(
        adopter,  
        adm,
        name,
        cpfOrCnpj,
        birthDate,
        phone,
        email,
        password,
        picture,
        verification,
        addressId
      );
      user.address = addressId;
      const createdUser = await this.userRepository.create(user);

      response.status(201).send({ data: createdUser });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  login = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email, password } = request.body;

      // const user = await this.userFactory.call(email, password);
      const user = await this.userRepository.login(email, password);

      response.status(201).send({ data: user });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  //TODO integrar etapas de redefinição de senha na estrutura
  forgotPassword = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email } = request.body;
      const result = await this.userRepository.forgotPassword(email);

      response.status(201).send({ data: result });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'UserExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}

export default new UserController();
