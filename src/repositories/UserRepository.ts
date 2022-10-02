import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { sendMail } from '../modules/mailer';
import UserModel, { IUserSchema } from '../models/User';
import Settings from '../types/Settings';
import { User } from '../types/IUser';
import { sendingEmailError, userExistsError, userNotFoundError } from '../errors/errors';
import bcrypt from 'bcrypt';
import { Address } from '../types/IAddress';
import { TodasOngsResponse } from '../models/responses/todasOngsResponse';

@injectable()
export class UserRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(userInfo: User) {
    try {
      const user = await UserModel.findOne({ $or: [{ cpfOrCnpj: userInfo.cpfOrCnpj }, { email: userInfo.email }] });

      if (user) throw userExistsError;

      const newUser = await UserModel.create(userInfo);
      await newUser.save();

      return this.toUserObject(newUser);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email: email }).select('+password');

      if (!user) throw userNotFoundError;

      return this.toUserObject(user);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findByCpfOrCnpj(cpfOrCnpj: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ cpfOrCnpj: cpfOrCnpj }).select('+password');

      if (!user) throw userNotFoundError;

      return this.toUserObject(user);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async forgotPassword(email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) throw userNotFoundError;

      const randomPassword = Math.random().toString(36).slice(-8);

      bcrypt.hash(randomPassword, 10, async (err, bcrypt) => {
        await UserModel.findByIdAndUpdate(user.id, {
          $set: {
            password: bcrypt,
          },
        });
      });

      const mailOptions = {
        from: 'adotadoguvv@gmail.com',
        to: email,
        subject: 'Recuperar Senha',
        text: 'Ola Segue codigo para recuperação de senha',
        html:
          `<html lang="pt">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <h3>Olá, ` +
          email +
          `!</h3>
            <p>Você solicitou a alteração da senha de sua conta na plataforma <strong>Adota Cão UVV</strong>.
            <br><br>Segue código de segurança para redefinição da senha:</p>
            <h3>Código: ` +
          randomPassword +
          `</h3>
            <br>
            <a href="https://adotacao.com/">www.adotacao.com.br</a>
        </body>
        </html>`,
      };

      sendMail(mailOptions);

      return this.toUserObject(user);
    } catch (e) {
      this.logger.error(e);
      throw sendingEmailError;
    }
  }

  async forgotPasswordFinish(idUsuario: string, senha: string): Promise<void> {
    try {
      bcrypt.hash(senha, 10, async (err, bcrypt) => {
        return await UserModel.findByIdAndUpdate(idUsuario, {
          $set: {
            password: bcrypt,
          },
        });
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async recuperarTodasOngs(): Promise<User[]> {
    try {
      const ongs = await UserModel.find({ adopter: false });

      const ongsObject: User[] = [];

      ongs.forEach((ong) => {
        ongsObject.push(this.toUserObject(ong));
      });

      return ongsObject;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async recuperarOngNome(nomeRegex: RegExp): Promise<User[]> {
    try {
      const ongs = await UserModel.find({ name: nomeRegex });

      const ongsObject: User[] = [];

      ongs.forEach((ong) => {
        ongsObject.push(this.toUserObject(ong));
      });

      return ongsObject;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public toTodasOngsObject(user: User, address: Address): TodasOngsResponse {
    return new TodasOngsResponse({
      id: user.id,
      adopter: user.adopter,
      name: user.name,
      cpfOrCnpj: user.cpfOrCnpj,
      picture: user.picture,
      verified: user.verified,
      address: address,
    });
  }

  private toUserObject(user: IUserSchema): User {
    return {
      id: user.id,
      adopter: user.adopter,
      adm: user.adm,
      name: user.name,
      cpfOrCnpj: user.cpfOrCnpj,
      birthDate: user.birthDate,
      phone: user.phone,
      email: user.email,
      password: user.password ? user.password : undefined,
      picture: user.picture,
      verified: user.verified,
      addressId: user.addressId,
    };
  }
}
