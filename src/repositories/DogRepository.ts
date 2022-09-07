import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import DogModel, { IDogSchema } from '../models/Dog';
import Settings from '../types/Settings';
import { Dog } from '../types/IDog';
import { dogExistsError } from '../errors/errors';

@injectable()
export class DogRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(dogInfo: Dog): Promise<Dog> {
    try {
      const newDog = await DogModel.create(dogInfo);
      // const newDog = new DogModel({
      //   adopter: dogInfo.adopter,
      //   name: dogInfo.name,
      //   cpfOrCnpj: dogInfo.cpfOrCnpj,
      //   address: dogInfo.address,
      //   birthDate: dogInfo.birthDate,
      //   phone: dogInfo.phone,
      //   email: dogInfo.email,
      //   password: dogInfo.password,
      // });
      await newDog.save();
      return this.toDogObject(newDog);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private toDogObject(dog: IDogSchema): Dog {
    return {
      id: dog.id,
      name: dog.name,
      age: dog.age,
      gender: dog.gender,
      size: dog.size,
      history: dog.history,
      picture: dog.picture,
      adopted: dog.adopted,
    };
  }
}
