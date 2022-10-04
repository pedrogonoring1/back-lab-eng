import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { DogRepository } from '../repositories/DogRepository';
import { DogFactory } from '../services/factories/DogFactory';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

@injectable()
export class DogController {
  @inject(DogRepository)
  private dogRepository: DogRepository;

  @inject(DogFactory)
  private dogFactory: DogFactory;

  router: express.Application;

  constructor(@inject(AuthenticationMiddleware) authMiddleware: AuthenticationMiddleware) {
    this.router = express()
      .use(authMiddleware.apply)
      .post('/create', this.create)
      .get('/recuperar/:idDog', this.recuperarPorId)
      .put('/editar', this.editarPorId);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { name, age, gender, size, history, picture, adopted } = request.body.data;

      const dog = await this.dogFactory.call(name, age, gender, size, history, picture, adopted);
      const createdDog = await this.dogRepository.create(dog);

      response.status(201).send({ data: createdDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  recuperarPorId = async (request: Request, response: Response): Promise<void> => {
    try {
      const { idDog } = request.params;

      const createdDog = await this.dogRepository.recuperarPorId(idDog);

      response.status(201).send({ data: createdDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  editarPorId = async (request: Request, response: Response): Promise<void> => {
    try {
      const cachorroEdit = request.body.cachorroConsulta;

      const createdDog = await this.dogRepository.updatePorId(cachorroEdit, cachorroEdit._id);

      response.status(201).send({ data: createdDog });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'DogExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
