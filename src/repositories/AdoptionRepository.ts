import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import AdoptionModel, { IAdoptionSchema } from '../models/Adoption';
import Settings from '../types/Settings';
import { Adoption } from '../types/IAdoption';
import { adoptionExistsError } from '../errors/errors';

@injectable()
export class AdoptionRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(adoptionInfo: Adoption): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findOne({ id: adoptionInfo.id });
      if (adoption) throw adoptionExistsError;

      const newAdoption = await AdoptionModel.create(adoptionInfo);
      // const newAdoption = new AdoptionModel({
      //   adopter: adoptionInfo.adopter,
      //   name: adoptionInfo.name,
      //   cpfOrCnpj: adoptionInfo.cpfOrCnpj,
      //   address: adoptionInfo.address,
      //   birthDate: adoptionInfo.birthDate,
      //   phone: adoptionInfo.phone,
      //   email: adoptionInfo.email,
      //   password: adoptionInfo.password,
      // });
      await newAdoption.save();
      return this.toUserObject(newAdoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async fetchByUser(userId: string): Promise<Adoption> {
    try {
      const adoptions = await AdoptionModel.find({ adopter: userId });
      if (!adoptions) throw adoptionExistsError;
      return this.toUserObject(adoptions);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private toUserObject(adoption: IAdoptionSchema): Adoption {
    return {
      id: adoption.id,
      date: adoption.date,
      status: adoption.status,
      dogId: adoption.dogId,
      userId: adoption.userId,
    };
  }
}
