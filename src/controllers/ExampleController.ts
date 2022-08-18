import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { ExampleRepository } from '../repositories/ExampleRepository';
import { ExampleFactory } from '../services/factories/ExampleFactory';

@injectable()
export class ExampleController {
  @inject(ExampleRepository)
  private exampleRepository: ExampleRepository;

  @inject(ExampleFactory)
  private exampleFactory: ExampleFactory;

  router: express.Application;

  constructor() {
    this.router = express().post('/', this.create);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { description } = request.body.data;

      const example = await this.exampleFactory.call(description);
      const createdExample = await this.exampleRepository.create(example);

      response.status(201).send({ data: createdExample });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'ExampleExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}
