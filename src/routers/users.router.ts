import { Router, Response } from 'express';
import { IQueryUserData } from '../models/users/query.types';
import {
  HTTP_STATUSES,
  IOutputModel,
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from '../models/common.types';
import { UserService } from '../services/users.service';
import { IUserOutput } from '../models/users/output.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreateUser } from '../models/users/input.types';
import { usersInputModelValidation } from '../validators/users.validator';
import { UserQueryRepository } from '../repositories/users/users.query.repo';

export const usersRouter = Router({});

usersRouter.get(
  '/',
  authMiddleware,
  async (req: RequestWithQuery<Partial<IQueryUserData>>, res: Response<IOutputModel<IUserOutput>>) => {
    const sortData: IQueryUserData = {
      pageNumber: req.query.pageNumber ?? 1,
      pageSize: req.query.pageSize ?? 10,
      searchEmailTerm: req.query.searchEmailTerm ?? null,
      searchLoginTerm: req.query.searchLoginTerm ?? null,
      sortBy: req.query.sortBy ?? 'createdAt',
      sortDirection: req.query.sortDirection ?? 'desc',
    };

    const users = await UserQueryRepository.getAll(sortData);
    return res.send(users);
  }
);

usersRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDelete = await UserService.removeUser(id);
  if (isDelete) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

usersRouter.post(
  '/',
  authMiddleware,
  usersInputModelValidation(),
  async (req: RequestWithBody<ICreateUser>, res: Response<IUserOutput>) => {
    const { email, login, password } = req.body;
    const user = await UserService.createUser({ email, login, password });
    return res.status(HTTP_STATUSES.CREATED_201).send(user);
  }
);
