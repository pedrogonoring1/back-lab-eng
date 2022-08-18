import Chance from 'chance';

import Example, { ExampleDocument } from '../../src/models/Example';

export async function setupExample(): Promise<ExampleDocument> {
  const chance = new Chance();

  const example = await new Example({
    description: chance.cf(),
  }).save();

  return example;
}
