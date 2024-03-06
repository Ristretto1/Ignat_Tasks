import { Router, Response, Request } from 'express';
import { HTTP_STATUSES, RequestWithBody } from '../models/common.types';
import { ILoginInputData } from '../models/auth/auth.types';
import { AuthService } from '../services/auth.service';
import { authLoginModelValidation } from '../validators/auth.validator';
import { authTokenMiddleware } from '../middlewares/auth/auth.middleware';
import { UserQueryRepository } from '../repositories/users/users.query.repo';

export const authRouter = Router();

authRouter.post('/login', authLoginModelValidation(), async (req: RequestWithBody<ILoginInputData>, res: Response) => {
  const { loginOrEmail, password } = req.body;

  const token = await AuthService.login({ loginOrEmail, password });
  if (token) return res.send(token);
  else return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
});

authRouter.get('/me', authTokenMiddleware, async (req: Request, res: Response) => {
  const { userId } = req;
  const user = await UserQueryRepository.getUserById(userId!);
  return res.send(user);
});
