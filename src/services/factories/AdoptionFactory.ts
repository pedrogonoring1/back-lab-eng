import { injectable } from 'inversify';

import { Adoption } from '../../types/IAdoption';

@injectable()
export class AdoptionFactory {
  async call(date: Date, status: number, dogId: string, userId: string): Promise<Adoption> {
    return {
      date,
      status,
      dogId,
      userId,
    };
  }
}
