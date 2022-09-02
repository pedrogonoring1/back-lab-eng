import Chance from 'chance';

import User, { IUserSchema } from '../../src/models/User';

export async function setupUser(): Promise<IUserSchema> {
  const chance = new Chance();

  const user = await new User({
    adopter: chance.cf(),
    name: chance.cf(),
    cpfOrCnpj: chance.cf(),
    address: chance.cf(),
    birthDate: chance.cf(),
    phone: chance.cf(),
    email: chance.cf(),
    password: chance.cf(),
  }).save();

  return user;
}
