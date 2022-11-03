import { injectable } from 'inversify';

import { Adoption } from '../../types/IAdoption';

@injectable()
export class AdoptionFactory {
  async call(date: Date, status: number, dog: string, adopter: string): Promise<Adoption> {
    return {
      date,
      status,
      dog,
      adopter,
    };
  }
}
