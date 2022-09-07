import { injectable } from 'inversify';

import { User } from '../../types/IUser';
import { invalidCpfOrCnpjError, invalidEmailError } from '../../errors/errors';

@injectable()
export class UserFactory {
  async call(
    adopter: boolean,
    adm: boolean,
    name: string,
    cpfOrCnpj: string,
    birthDate: Date,
    phone: string,
    email: string,
    password: string | undefined,
    picture: string,
    verified: boolean,
    addressId: string
  ): Promise<User> {
    const validCpfOrCnpj = this.checkCpfOrCnpj(cpfOrCnpj);
    const validEmail = this.checkEmail(email);

    return {
      adopter,
      adm,
      name,
      cpfOrCnpj: validCpfOrCnpj,
      birthDate,
      phone,
      email: validEmail,
      password,
      picture,
      verified,
      addressId,
    };
  }

  private checkCpfOrCnpj(cpfOrCnpj: string): string {
    const cpfOrCnpjRegex =
      /([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/g;

    if (!cpfOrCnpjRegex.test(cpfOrCnpj)) throw invalidCpfOrCnpjError;

    return cpfOrCnpj;
  }

  private checkEmail(email: string): string {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;

    if (!emailRegex.test(email)) throw invalidEmailError;

    return email;
  }
}
