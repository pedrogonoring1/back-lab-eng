import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { UserRepository } from '../repositories/UserRepository';
import { AdoptionRepository } from '../repositories/AdoptionRepository';
import { UserFactory } from '../services/factories/UserFactory';

import { AddressRepository } from '../repositories/AddressRepository';
import { AddressFactory } from '../services/factories/AddressFactory';
import { LoginAuthorizer } from '../services/LoginAuthorizer';
import { AddressFetcher } from '../services/AddressFetcher';

@injectable()
export class UserController {
  @inject(UserRepository) userRepository: UserRepository;
  @inject(UserFactory) userFactory: UserFactory;
  @inject(AddressRepository) addressRepository: AddressRepository;
  @inject(AdoptionRepository) adoptionRepository: AdoptionRepository;
  @inject(AddressFactory) addressFactory: AddressFactory;
  @inject(LoginAuthorizer) loginAuthorizer: LoginAuthorizer;
  @inject(AddressFetcher) addressFetcher: AddressFetcher;

  router: express.Application;

  constructor() {
    this.router = express()
      .post('/create', this.create)
      .post('/login', this.login)
      .put('/reset-password', this.forgotPassword)
      .get('/cachorro', this.listaDogs);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { adopter, adm, name, cpfOrCnpj, birthDate, phone, email, password, picture, verified, cep } =
        request.body.data;

      const address = await this.addressFetcher.apply(cep);
      const createdAddress = await this.addressRepository.create(address);

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
        verified,
        createdAddress.id
      );

      const createdUser = await this.userRepository.create(user);

      response.status(201).send({ data: { ...createdUser, password: undefined } });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  login = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email, password } = request.body;

      const user = await this.userRepository.findByEmail(email);

      const jwt = await this.loginAuthorizer.apply(user, password);

      response.status(200).send({ data: { ...user, password: undefined, jwt } });
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

  listaDogs = async (request: Request, response: Response): Promise<void> => {
    try{
      const userId = request.body.id;

      console.log(userId)
      const ong = await this.userRepository.findById(userId);
      const adoption = await this.adoptionRepository.findByUserId(userId)

      console.log(adoption)

      response.status(201).send({ data: adoption });

    } catch(e){
      this.errorHandler(e, response)
    }
  }

  private errorHandler(e: any, response: Response): Response {
    const BAD_REQUEST_ERRORS = [
      'UserNotFound',
      'IncorrectPassword',
      'UserNotVerified',
      'SendingEmail',
      'InvalidCpfOrCnpj',
      'InvalidEmail',
      'UserExists',
    ];

    if (BAD_REQUEST_ERRORS.includes(e.name)) return response.status(400).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}

