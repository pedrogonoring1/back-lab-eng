import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { AdoptionRepository } from '../repositories/AdoptionRepository';
import { AdoptionFactory } from '../services/factories/AdoptionFactory';

@injectable()
export class AdoptionController {
  @inject(AdoptionRepository)
  private adoptionRepository: AdoptionRepository;

  @inject(AdoptionFactory)
  private adoptionFactory: AdoptionFactory;

  router: express.Application;

  constructor() {
    this.router = express().post('/create', this.create);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { date, status, dogId, userId } = request.body;
      const adoption = await this.adoptionFactory.call(date, status, dogId, userId);
      const createdAdoption = await this.adoptionRepository.create(adoption);
      response.status(201).send({ data: createdAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'AdoptionExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
