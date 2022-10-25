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
  @inject(AddressFetcher) addressFetcher: AddressFetcher;
  @inject(LoginAuthorizer) loginAuthorizer: LoginAuthorizer;

  router: express.Application;

  constructor() {
    this.router = express()
      .post('/create', this.create)
      .post('/login', this.login)
      .get('/list', this.list)
      .get('/listShelters', this.listShelters)
      .get('/listShelters/:name', this.listSheltersByName)
      .get('/listNewShelters/:verified', this.listNewShelters)
      .get('/listAdopters', this.listAdopters)
      .get('/listAdopters/:name', this.listAdoptersByName)
      .get('/find/:id', this.find)
      .get('/find/:cpfOrCnpj', this.findByCpfOrCnpj)
      .put('/update/:id', this.update)
      .put('/update-password/:id', this.updatePassword)
      .put('/reset-password', this.forgotPassword)
      .put('/reset-password/finish', this.forgotPasswordFinish)
      .delete('/delete/:id', this.delete);
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
      response.status(200).send({ data: readedUser, password: undefined });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  findByCpfOrCnpj = async (request: Request, response: Response): Promise<void> => {
    try {
      const ongOrUser = request.params['cpfOrCnpj'];
      const user = await this.userRepository.findByCpfOrCnpj(ongOrUser);
      response.status(200).send({ data: { ...user, password: undefined } });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  list = async (_: Request, response: Response): Promise<void> => {
    try {
      const listedUsers = await this.userRepository.list();
      response.status(200).send({ data: listedUsers, password: undefined });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listShelters = async (_: Request, response: Response): Promise<void> => {
    try {
      const listedUsers = await this.userRepository.listShelters();
      response.status(200).send({ data: listedUsers, password: undefined });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listSheltersByName = async (request: Request, response: Response): Promise<void> => {
    try {
      const shelterAlias = request.params['nome'].replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
      const regex = new RegExp(shelterAlias, 'g');
      const users = await this.userRepository.listSheltersByName(regex);
      response.status(200).send({ data: { ...users, password: undefined } });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listNewShelters = async (request: Request, response: Response): Promise<void> => {
    try{
      const verified = request.params['verified'];
      const listedNewShelters = await this.userRepository.listSheltersNotVerified(verified);
      response.status(200).send({data:listedNewShelters, password: undefined})
    } catch (e) {
      this.errorHandler(e, response);
    }
  }

  listAdopters = async (_: Request, response: Response): Promise<void> => {
    try {
      const listedUsers = await this.userRepository.listAdopters();
      response.status(200).send({ data: listedUsers, password: undefined });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listAdoptersByName = async (request: Request, response: Response): Promise<void> => {
    try {
      const adopterAlias = request.params['nome'].replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
      const regex = new RegExp(adopterAlias, 'g');
      const users = await this.userRepository.listAdoptersByName(regex);
      response.status(200).send({ data: { ...users, password: undefined } });
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

  updatePassword = async (request: Request, response: Response): Promise<void> => {
    try {
      const userID = request.params['id'];
      const newPassword = request.body.password;
      const updatedUser = await this.userRepository.updatePassword(userID, newPassword);
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
