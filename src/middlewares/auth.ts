import { verify } from 'jsonwebtoken';
import 'dotenv/config';
import settings from '../config/settings';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request | any, res: Response, next: NextFunction) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) return res.status(401).json({ success: false, message: 'Informe o token' });

  if (token.toString().startsWith('Bearer ')) {
    token = token.slice(7, token.toString().length);
  }
  if (token) {
    verify(String(token), settings.secret, (error, decoded) => {
      if (error) {
        res.status(401).json({ success: false, message: 'Token Inválido', error });
      } else {
        res.locals.auth_data = decoded;
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Token não informado' });
  }
};

export default auth;
