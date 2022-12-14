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
    this.router = express()
      .post('/create', this.create)
      .get('/list', this.list)
      .get('/listByAdopter/:id', this.listByAdopter)
      .get('/listByDog/:id', this.listByDog)
      .get('/listByShelter/:id', this.listByShelter)
      .get('/listByShelterInProgress/:id', this.listByShelterInProgress)
      .get('/listByShelterApproved/:id', this.listByShelterApproved)
      .get('/listByShelterRefused/:id', this.listByShelterRefused)
      .get('/find/:id', this.find)
      .put('/update/:id', this.update)
      .put('/approve/:id', this.approve)
      .put('/refuse/:id', this.refuse)
      .delete('/delete/:id', this.delete);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { dog, adopter } = request.body;
      const date = new Date();
      const status = 0;
      const adoption = await this.adoptionFactory.call(date, status, dog, adopter);
      const createdAdoption = await this.adoptionRepository.create(adoption);
      response.status(201).send({ data: createdAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  find = async (request: Request, response: Response): Promise<void> => {
    try {
      const readedAdoption = await this.adoptionRepository.find(request.params.id);
      response.status(201).send({ data: readedAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  list = async (_: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.list();
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByShelter = async (request: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.listByShelter(request.params.id);
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByAdopter = async (request: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.listByAdopter(request.params.id);
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByDog = async (request: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.listByDog(request.params.id);
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByShelterInProgress = async (request: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.listByShelterInProgress(request.params.id);
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByShelterApproved = async (request: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.listByShelterApproved(request.params.id);
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  listByShelterRefused = async (request: Request, response: Response): Promise<void> => {
    try {
      const listedAdoptions = await this.adoptionRepository.listByShelterRefused(request.params.id);
      response.status(201).send({ data: listedAdoptions });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  update = async (request: Request, response: Response): Promise<void> => {
    try {
      const updatedAdoption = await this.adoptionRepository.update(request.params.id, request.body);
      response.status(201).send({ data: updatedAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  approve = async (request: Request, response: Response): Promise<void> => {
    try {
      const approvedAdoption = await this.adoptionRepository.approve(request.params.id);
      response.status(201).send({ data: approvedAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  refuse = async (request: Request, response: Response): Promise<void> => {
    try {
      const refusedAdoption = await this.adoptionRepository.refuse(request.params.id);
      response.status(201).send({ data: refusedAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    try {
      const deletedAdoption = await this.adoptionRepository.delete(request.params.id);
      response.status(201).send({ data: deletedAdoption });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'AdoptionExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
