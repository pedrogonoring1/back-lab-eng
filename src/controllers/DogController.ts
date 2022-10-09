import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { DogRepository } from '../repositories/DogRepository';
import { DogFactory } from '../services/factories/DogFactory';
import { UserRepository } from '../repositories/UserRepository';

@injectable()
export class DogController {
  @inject(DogRepository)
  private dogRepository: DogRepository;
  @inject(UserRepository)
  private userRepository: UserRepository;

  @inject(DogFactory)
  private dogFactory: DogFactory;

  router: express.Application;

  constructor() {
    this.router = express()
      .post('/create', this.create)
      .get('/list', this.list)
      .get('/listByShelter/:id', this.listByShelter)
      .get('/find/:id', this.find)
      .put('/update/:id', this.update)
      .delete('/delete/:id', this.delete);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      console.log('teste', request.body);
      const { name, age, gender, size, history, picture, adopted } = request.body;
      const dog = await this.dogFactory.call(name, age, gender, size, history, picture, adopted);
      const createdDog = await this.dogRepository.create(dog);
      response.status(201).send({ data: createdDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  find = async (request: Request, response: Response): Promise<void> => {
    try {
      const readedDog = await this.dogRepository.find(request.params.id);
      response.status(200).send({ data: readedDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  list = async (_: Request, response: Response): Promise<void> => {
    try {
      const listedDogs = await this.dogRepository.list();
      response.status(200).send({ data: listedDogs });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByShelter = async (request: Request, response: Response): Promise<void> => {
    try {
      const readedShelter = await this.userRepository.find(request.params.id);
      console.log('readedShelter', readedShelter);
      if (readedShelter.adopter) response.status(409).send({ error: 'Usuário não é um abrigo.' });

      const listedDogs = await this.dogRepository.listByShelter(readedShelter.id);
      console.log('listedDogs', listedDogs);
      response.status(201).send({ data: listedDogs });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  update = async (request: Request, response: Response): Promise<void> => {
    try {
      const updatedDog = await this.dogRepository.update(request.params.id, request.body);
      response.status(201).send({ data: updatedDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    try {
      const deletedDog = await this.dogRepository.delete(request.params.id);
      response.status(201).send({ data: deletedDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'DogExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
