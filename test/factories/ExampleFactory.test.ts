import { expect } from 'chai';

import { ExampleFactory } from '../../src/services/factories/ExampleFactory';
import { getTestContainer } from '../helpers/getTestContainer';

describe('ExampleFactory', () => {
  const factory = getTestContainer().get(ExampleFactory);

  describe('#call', () => {
    describe('with valid example', () => {
      it('returns an example object', async () => {
        const example = await factory.call('abc123');

        expect(example).to.deep.equal({
          description: 'abc123',
        });
      });
    });
  });
});
