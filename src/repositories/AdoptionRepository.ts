import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { List } from 'lodash';

import AdoptionModel, { IAdoptionSchema } from '../models/Adoption';
import DogModel from '../models/Dog';
import Settings from '../types/Settings';
import { Adoption } from '../types/IAdoption';
import { adoptionExistsError, adoptionNotFoundError } from '../errors/errors';

@injectable()
export class AdoptionRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(adoptionInfo: Adoption): Promise<Adoption> {
    try {
      const adoption = await AdoptionModel.findOne({ dog: adoptionInfo.dog, adopter: adoptionInfo.adopter });
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

  async listByDog(dogId: string): Promise<List<Adoption>> {
    try {
      const adoptions = await AdoptionModel.find({ dog: dogId }).populate('dog').populate('adopter');
      if (!adoptions) throw adoptionNotFoundError;
      adoptions.forEach((it) => this.toAdoptionObject(it));
      return adoptions;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async listByShelter(shelterId: string): Promise<List<Adoption>> {
    try {
      const adoptions = await AdoptionModel.find()
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

  async listByShelterInProgress(shelterId: string): Promise<List<Adoption>> {
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

  async listByShelterApproved(shelterId: string): Promise<List<Adoption>> {
    try {
      const adoptions = await AdoptionModel.find({ status: 1 })
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

  async listByShelterRefused(shelterId: string): Promise<List<Adoption>> {
    try {
      const adoptions = await AdoptionModel.find({ status: 2 })
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
      const adoption = await AdoptionModel.findByIdAndUpdate(adoptionId, adoptionInfo, { new: true });
      if (!adoption) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoption);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async approve(adoptionId: string): Promise<Adoption> {
    try {
      const adoptionApproved = await AdoptionModel.findByIdAndUpdate(adoptionId, { status: 1 }, { new: true });
      if (!adoptionApproved) throw adoptionNotFoundError;
      await AdoptionModel.updateMany(
        { id: { $ne: adoptionApproved.id }, dog: adoptionApproved.dog, status: 0 },
        { status: 2 }
      );
      await DogModel.findByIdAndUpdate(adoptionApproved.dog, { adopted: true });
      return this.toAdoptionObject(adoptionApproved);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async refuse(adoptionId: string): Promise<Adoption> {
    try {
      const adoptionRefused = await AdoptionModel.findByIdAndUpdate(
        { adopter: adoptionId },
        { status: 2 },
        { new: true }
      );
      if (!adoptionRefused) throw adoptionNotFoundError;
      return this.toAdoptionObject(adoptionRefused);
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

  private toAdoptionObject(adoption: IAdoptionSchema): Adoption {
    return {
      id: adoption.id,
      date: adoption.date,
      status: adoption.status,
      dog: adoption.dog,
      adopter: adoption.adopter,
    };
  }
}
