import { Logger } from 'winston';
import { compare } from 'bcrypt';
import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';

import { incorrectPasswordError } from '../errors/errors';
import { User } from '../types/IUser';
import Settings from '../types/Settings';

@injectable()
export class LoginAuthorizer {
  @inject('Logger') logger!: Logger;
  @inject('Settings') settings: Settings;

  async apply(user: User, password: string): Promise<string> {
    try {
      const isPasswordCorrect = await compare(password, user.password);

      if (!isPasswordCorrect) throw incorrectPasswordError;

      const token = jwt.sign({ userId: user.id, email: user.email }, this.settings.tokenKey, {
        expiresIn: '2h',
      });

      return token;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
