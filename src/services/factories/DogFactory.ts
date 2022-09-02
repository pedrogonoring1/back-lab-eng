import { injectable } from 'inversify';

import { Dog } from '../../types/IDog';

@injectable()
export class DogFactory {
  async call(
    name: string,
    age: number,
    gender: number,
    size: number,
    history: string,
    picture: string,
    adopted: boolean

    // adopter: boolean,
    // adm: boolean,
    // name: string,
    // cpfOrCnpj: string,
    // birthDate: Date,
    // phone: string,
    // email: string,
    // password: string | undefined,
    // picture: string,
    // verification: boolean,
    // address: string
  ): Promise<Dog> {
    return {
      name,
      age,
      gender,
      size,
      history,
      picture,
      adopted,
    };
  }
}
