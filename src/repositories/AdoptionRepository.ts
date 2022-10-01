import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import AdoptionModel, { IAdoptionSchema } from '../models/Adoption';
import Settings from '../types/Settings';
import { Adoption } from '../types/IAdoption';
import { adoptionExistsError, cannotReturnDogs } from '../errors/errors';
import { Types } from 'mongoose';

@injectable()
export class AdoptionRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(adoptionInfo: Adoption): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findOne({ adopter: adoptionInfo.userId, dog: adoptionInfo.dogId });
      if (adoption) throw adoptionExistsError;

      const objAdoption = { date: adoptionInfo.date, status: adoptionInfo.status, dog: adoptionInfo.dogId, adopter: adoptionInfo.userId}

      const newAdoption = await AdoptionModel.create(objAdoption);
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

  async findByUserId(id: string): Promise<any[]> {
    try{
      const adoption = await AdoptionModel.find({adopter: id})

      if(!adoption) throw cannotReturnDogs;

      return adoption
    } catch(e){
      this.logger.error(e)
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
