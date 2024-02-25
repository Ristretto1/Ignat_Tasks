import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../models/common.types';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const [type, token] = auth.split(' ');
  if (type !== 'Basic') return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const decodedString = Buffer.from(token, 'base64').toString();
  const [login, password] = decodedString.split(':');
  if (login !== process.env.BASIC_LOGIN || password !== process.env.BASIC_PASSWORD) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }

  return next();
};
