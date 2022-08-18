import { injectable } from 'inversify';

import { Example } from '../../types/IExample';

@injectable()
export class ExampleFactory {
  async call(description: string): Promise<Example> {
    return {
      description,
    };
  }
}
