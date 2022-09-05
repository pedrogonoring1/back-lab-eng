import { injectable } from 'inversify';

import { User } from '../../types/IUser';
import { Address } from '../../types/IAddress';

@injectable()
export class UserFactory {
  async call(
    adopter: boolean,
    adm: boolean,
    name: string,
    cpfOrCnpj: string,
    birthDate: Date,
    phone: string,
    email: string,
    password: string | undefined,
    picture: string,
    verification: boolean,
    address: string
  ): Promise<User> {
    return {
      adopter,
      adm,
      name,
      cpfOrCnpj,
      birthDate,
      phone,
      email,
      password,
      picture,
      verification,
      address
    };
  }
}
