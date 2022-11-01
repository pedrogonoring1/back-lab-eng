import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { List } from 'lodash';

import AdoptionModel, { IAdoptionSchema } from '../models/Adoption';
import Settings from '../types/Settings';
import { Adoption } from '../types/IAdoption';
import { adoptionExistsError, adoptionNotFoundError } from '../errors/errors';

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
      return this.toAdoptionObject(newAdoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async find(adoptionId: string): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findById(adoptionId);
      if (!adoption) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async list(): Promise<List<Adoption>> {
    try {
      const adoptions = await AdoptionModel.find({}).populate('dog').populate('adopter');
      if (!adoptions) throw adoptionNotFoundError;
      adoptions.forEach((it) => this.toAdoptionObject(it));
      return adoptions;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async listInProgressByShelter(shelterId: string): Promise<List<Adoption>> {
    try {
      const adoptions = await AdoptionModel.find({ status: 0 })
        .populate({ path: 'dog', match: { shelter: { $eq: shelterId } } })
        .populate('adopter');
      if (!adoptions) throw adoptionNotFoundError;
      adoptions.forEach((it) => this.toAdoptionObject(it));
      return adoptions;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(adoptionId: string, adoptionInfo: Adoption): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findByIdAndUpdate(adoptionId, adoptionInfo);
      if (!adoption) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async delete(adoptionId: string): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findByIdAndDelete(adoptionId);
      if (!adoption) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async approveAdoption(adoptionId: string): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findByIdAndUpdate(adoptionId, { status: 1 });
      if (!adoption) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async refuseAdoption(adoptionId: string): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findByIdAndUpdate(adoptionId, { status: 2 });
      if (!adoption) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private toAdoptionObject(adoption: IAdoptionSchema): Adoption {
    return {
      id: adoption.id,
      date: adoption.date,
      status: adoption.status,
      dogId: adoption.dogId,
      userId: adoption.userId,
    };
  }
}
