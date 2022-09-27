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
      await newAdoption.save();
      return this.toUserObject(newAdoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
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
