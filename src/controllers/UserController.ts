import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { UserRepository } from '../repositories/UserRepository';
import { UserFactory } from '../services/factories/UserFactory';

import { AddressRepository } from '../repositories/AddressRepository';
import { AddressFactory } from '../services/factories/AddressFactory';
import { LoginAuthorizer } from '../services/LoginAuthorizer';
import { AddressFetcher } from '../services/AddressFetcher';
import { compare } from 'bcrypt';
import { incorrectPasswordError } from '../errors/errors';

@injectable()
export class UserController {
  @inject(UserRepository) userRepository: UserRepository;
  @inject(UserFactory) userFactory: UserFactory;
  @inject(AddressRepository) addressRepository: AddressRepository;
  @inject(AddressFactory) addressFactory: AddressFactory;
  @inject(LoginAuthorizer) loginAuthorizer: LoginAuthorizer;
  @inject(AddressFetcher) addressFetcher: AddressFetcher;

  router: express.Application;

  constructor() {
    this.router = express()
      .post('/create', this.create)
      .get('/list', this.list)
      .get('/find/:id', this.find)
      .put('/update/:id', this.update)
      .delete('/delete/:id', this.delete)
      .post('/login', this.login)
      .put('/reset-password', this.forgotPassword)
      .put('/reset-password/finish', this.forgotPasswordFinish)
      .get('/recuperar-todas-ongs', this.recuperarTodasOngs)
      .get('/recuperar-todas-ongs-nome/:nome', this.recuperarOngPorNome);
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

  find = async (request: Request, response: Response): Promise<void> => {
    try {
      const readedUser = await this.userRepository.find(request.params.id);
      response.status(201).send({ data: readedUser });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  list = async (response: Response): Promise<void> => {
    try {
      const listedUsers = await this.userRepository.list();
      response.status(201).send({ data: listedUsers });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  update = async (request: Request, response: Response): Promise<void> => {
    try {
      const updatedUser = await this.userRepository.update(request.params.id, request.body);
      response.status(201).send({ data: updatedUser });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    try {
      const deletedUser = await this.userRepository.delete(request.params.id);
      response.status(201).send({ data: deletedUser });
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

  forgotPasswordFinish = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email, codigo, senha } = request.body;

      const user = await this.userRepository.findByEmail(email.email);

      const isPasswordCorrect = await compare(codigo, user.password);

      if (!isPasswordCorrect) throw incorrectPasswordError;

      await this.userRepository.forgotPasswordFinish(user.id, senha);

      response.status(200).send({ data: { ...user, password: undefined } });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  recuperarTodasOngs = async (request: Request, response: Response): Promise<void> => {
    try {
      const user = await this.userRepository.recuperarTodasOngs();

      response.status(200).send({ data: { ...user, password: undefined } });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  recuperarOngPorNome = async (request: Request, response: Response): Promise<void> => {
    try {
      const ongAlias = request.params['nome'].replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
      const regex = new RegExp(ongAlias, 'g');

      const user = await this.userRepository.recuperarOngNome(regex);

      response.status(200).send({ data: { ...user, password: undefined } });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

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
