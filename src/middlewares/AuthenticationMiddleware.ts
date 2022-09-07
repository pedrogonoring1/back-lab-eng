import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories/UserRepository';
import Settings from '../types/Settings';

@injectable()
export class AuthenticationMiddleware {
  @inject(UserRepository) userRepository: UserRepository;
  @inject('Settings') settings: Settings;

  apply = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    if (!request.headers.authorization) {
      const error = new Error('Authorization Error');
      error.name = 'UnauthorizedError';
      throw error;
    }

    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.replace('Bearer ', '');

    try {
      jwt.verify(token, this.settings.tokenKey);

      next();
    } catch (err) {
      response.status(401).send({ error: { detail: 'Invalid token' } });
    }
  };
}
