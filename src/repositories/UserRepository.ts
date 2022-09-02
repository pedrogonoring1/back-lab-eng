import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import createToken from '../middlewares/createToken';

import UserModel, { IUserSchema } from '../models/User';
import Settings from '../types/Settings';
import { User } from '../types/IUser';
import { incorrectPassword, userExistsError, userNotFound, userNotVerified } from '../errors/errors';

import JWT from 'jsonwebtoken';
import crypto from 'crypto';

// import Token = from "../models/Token.model";
// import sendEmail from "../utils/email/sendEmail";
// const bcrypt = require("bcrypt");

//ALTERAR .env
const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

@injectable()
export class UserRepository {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async create(userInfo: User): Promise<User> {
    try {
      const user = await UserModel.findOne({ cpfOrCnpj: userInfo.cpfOrCnpj });
      if (user) throw userExistsError;

      const newUser = await UserModel.create(userInfo);
      // const newUser = new UserModel({
      //   adopter: userInfo.adopter,
      //   name: userInfo.name,
      //   cpfOrCnpj: userInfo.cpfOrCnpj,
      //   address: userInfo.address,
      //   birthDate: userInfo.birthDate,
      //   phone: userInfo.phone,
      //   email: userInfo.email,
      //   password: userInfo.password,
      // });
      await newUser.save();
      return this.toUserObject(newUser);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) throw userNotFound;

      const correctPassword = await bcrypt.compare(password, String(user.password));
      if (!correctPassword) throw incorrectPassword;

      if (!user.adopter && !user.verification) throw userNotVerified;

      user.password = undefined;
      // const token = createToken(user._id);

      return this.toUserObject(user);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
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
      password: undefined,
      picture: user.picture,
      verification: user.verification,
      address: user.address,
    };
  }

  async signup(data: User): Promise<User> {
    let user = await UserModel.findOne({ email: data.email });
    if (user) {
      throw new Error('Email already exist'); //, 422);
    }
    user = new UserModel(data);
    // const token = this.JWT.sign({ id: user._id }, this.JWTSecret);
    const token = createToken(user._id);
    await user.save();

    return this.toUserObject(user);
  }

  async requestPasswordReset(email: string): Promise<User> {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Email does not exist');

    const token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    // await new Token({
    //   userId: user._id,
    //   token: hash,
    //   createdAt: Date.now(),
    // }).save();

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(
      user.email,
      'Password Reset Request',
      {
        name: user.name,
        link: link,
      },
      './template/requestResetPassword.handlebars'
    );
    return link;
  }

  async resetPassword(userId: string, token: string, password: string): Promise<User> {
    const passwordResetToken = await Token.findOne({ userId });

    if (!passwordResetToken) {
      throw new Error('Invalid or expired password reset token');
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      throw new Error('Invalid or expired password reset token');
    }

    const hash = await bcrypt.hash(password, Number(bcryptSalt));

    await User.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });

    const user = await UserModel.findById({ _id: userId });

    sendEmail(
      user.email,
      'Password Reset Successfully',
      {
        name: user.name,
      },
      './template/resetPassword.handlebars'
    );

    await passwordResetToken.deleteOne();

    return true;
  }

  // module.exports = {
  //   signup,
  //   requestPasswordReset,
  //   resetPassword,
  // };
}
