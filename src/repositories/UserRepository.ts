import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import transport from '../modules/mailer';
import UserModel, { IUserSchema } from '../models/User';
import Settings from '../types/Settings';
import { User } from '../types/IUser';
import { sendingEmailError, userExistsError, userNotFoundError } from '../errors/errors';

//ALTERAR .env
const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

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

  async forgotPassword(email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) throw userNotFoundError;

      // const token = createToken(user._id);
      // const now = new Date();
      // now.setHours(now.getHours() + 1);

      // await UserModel.findByIdAndUpdate(user.id, {
      //     '$set': {
      //         passwordResetToken: token,
      //         passwordResetExpires: now,
      //     }
      // });

      const randomPassword = Math.random().toString(36).slice(-8);

      await UserModel.findByIdAndUpdate(user.id, {
        $set: {
          password: randomPassword,
        },
      });

      transport.sendMail(
        {
          to: email,
          from: 'uvv.jpcampos@gmail.com', //para aonde sera enviado este email
          template: 'auth/forgot_password',
          context: { randomPassword },
        },
        (err: any) => {
          if (err) throw sendingEmailError;
        }
      );

      return this.toUserObject(user);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  /*
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
  */

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
