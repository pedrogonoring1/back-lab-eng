import { verify } from 'jsonwebtoken';
import 'dotenv/config';
import settings from '../config/settings';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request | any, res: Response, next: NextFunction) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) return res.status(401).json({ success: false, message: 'No Token provided' });

  if (token.toString().startsWith('Bearer ')) token = token.slice(7, token.toString().length);

  if (!token) return res.status(401).json({ success: false, message: 'No Token provided' });
  else {
    verify(String(token), settings.secret, (error, decoded) => {
      if (error) {
        res.status(401).json({ success: false, message: 'Invalid Token', error });
      } else {
        res.locals.auth_data = decoded;
        req.decoded = decoded;
        next();
      }
    });
  }
};

export default auth;
