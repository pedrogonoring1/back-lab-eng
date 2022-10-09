import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import DogModel, { IDogSchema } from '../models/Dog';
import Settings from '../types/Settings';
import { Dog } from '../types/IDog';
import { dogNotFoundError } from '../errors/errors';
import { List } from 'lodash';

@injectable()
export class DogRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(dogInfo: Dog): Promise<Dog> {
    try {
      const newDog = await DogModel.create(dogInfo);
      await newDog.save();
      return this.toDogObject(newDog);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async find(dogId: string): Promise<Dog> {
    try {
      const dog = await DogModel.findById(dogId);
      if (!dog) throw dogNotFoundError;
      return this.toDogObject(dog);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async list(): Promise<List<Dog>> {
    try {
      const dogs = await DogModel.find({});
      if (!dogs) throw dogNotFoundError;
      dogs.forEach((it) => this.toDogObject(it));
      return dogs;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async listByShelter(shelterId: string): Promise<List<Dog>> {
    try {
      const dogs = await DogModel.find({ shelter: shelterId });
      console.log('dogs', dogs);
      if (!dogs) throw dogNotFoundError;
      dogs.forEach((it) => this.toDogObject(it));
      return dogs;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(dogId: string, dogInfo: Dog): Promise<Dog> {
    try {
      const dog = await DogModel.findByIdAndUpdate(dogId, dogInfo);
      if (!dog) throw dogNotFoundError;
      return this.toDogObject(dog);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async delete(dogId: string): Promise<Dog> {
    try {
      const dog = await DogModel.findByIdAndDelete(dogId);
      if (!dog) throw dogNotFoundError;
      return this.toDogObject(dog);
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
