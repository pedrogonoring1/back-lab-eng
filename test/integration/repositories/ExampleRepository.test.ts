import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';

import { ExampleRepository } from '../../../src/repositories/ExampleRepository';
import { getTestContainer } from '../../helpers/getTestContainer';
import { example as exampleFixture } from '../../fixtures/exampleInfo';
import { Example } from '../../../src/types/IExample';

chai.use(chaiAsPromised);

describe('ExampleRepository', () => {
  const repository = getTestContainer().get(ExampleRepository);

  let exampleInfo: Example;

  beforeEach(async () => {
    exampleInfo = { ...exampleFixture };
  });

  describe('#create', () => {
    describe('when the example does not exist', () => {
      it('stores the example object', async () => {
        const example = await repository.create(exampleInfo);

        expect(example).to.deep.eq({
          ...example,
          description: exampleInfo.description,
        });
      });

      describe('when the example exists', () => {
        let exampleObject: Example;

        beforeEach(async () => {
          exampleObject = await repository.create(exampleInfo);
        });

        it('throws an error', async () => {
          await expect(repository.create(exampleObject)).to.be.rejectedWith('Example already exists');
        });
      });
    });
  });
});
