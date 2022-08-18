import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import ExampleModel, { ExampleDocument } from '../models/Example';
import Settings from '../types/Settings';
import { Example } from '../types/IExample';
import { exampleExistsError } from '../errors/errors';

@injectable()
export class ExampleRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(exampleInfo: Example): Promise<Example> {
    try {
      const example = await ExampleModel.findOne({ description: exampleInfo.description });

      if (example) throw exampleExistsError;

      const newExample = new ExampleModel({
        description: exampleInfo.description,
      });

      await newExample.save();
      return this.toExampleObject(newExample);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private toExampleObject(example: ExampleDocument): Example {
    return {
      id: example.id,
      description: example.description,
    };
  }
}
