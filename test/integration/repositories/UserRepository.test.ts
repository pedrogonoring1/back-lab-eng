import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';

import { UserRepository } from '../../../src/repositories/UserRepository';
import { getTestContainer } from '../../helpers/getTestContainer';
import { user as userFixture } from '../../fixtures/userInfo';
import { User } from '../../../src/types/IUser';

chai.use(chaiAsPromised);

describe('UserRepository', () => {
  const repository = getTestContainer().get(UserRepository);

  let userInfo: User;

  beforeEach(async () => {
    userInfo = { ...userFixture };
  });

  describe('#create', () => {
    describe('when the user does not exist', () => {
      it('stores the user object', async () => {
        const user = await repository.create(userInfo);

        expect(user).to.deep.eq({
          ...user,
          adopter: userInfo.adopter,
          name: userInfo.name,
          cpfOrCnpj: userInfo.cpfOrCnpj,
          address: userInfo.addressId,
          birthDate: userInfo.birthDate,
          phone: userInfo.phone,
          email: userInfo.email,
          password: userInfo.password,
        });
      });

      describe('when the user exists', () => {
        let userObject: User;

        beforeEach(async () => {
          userObject = await repository.create(userInfo);
        });

        it('throws an error', async () => {
          await expect(repository.create(userObject)).to.be.rejectedWith('User already exists');
        });
      });
    });
  });
});
