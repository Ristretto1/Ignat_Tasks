import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../models/common.types';
import { SETTINGS } from '../../settings/settings';
import { TokenService } from '../../services/token.service';
import { UserQueryRepository } from '../../repositories/users/users.query.repo';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const [type, token] = auth.split(' ');
  if (type !== 'Basic') return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const decodedString = Buffer.from(token, 'base64').toString();
  const [login, password] = decodedString.split(':');
  if (login !== SETTINGS.BASIC_LOGIN || password !== SETTINGS.BASIC_PASSWORD) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }

  return next();
};

export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const [type, token] = auth.split(' ');
  if (type !== 'Bearer') return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const payload = await TokenService.verifyToken(token);
  if (!payload) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  const { userId } = payload;
  const user = await UserQueryRepository.getUserById(userId);
  if (!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

  req.userId = userId;
  return next();
};
