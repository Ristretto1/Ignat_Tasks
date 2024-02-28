import { Router, Response } from 'express';
import { HTTP_STATUSES, RequestWithBody } from '../models/common.types';
import { ILoginInputData } from '../models/auth/auth.types';
import { AuthService } from '../services/auth.service';
import { authLoginModelValidation } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post(
  '/login',
  authLoginModelValidation(),
  async (req: RequestWithBody<ILoginInputData>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const isLogged = await AuthService.login({ loginOrEmail, password });
    if (isLogged) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }
);
