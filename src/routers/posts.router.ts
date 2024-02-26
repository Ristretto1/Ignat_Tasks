import { Router, Request, Response } from 'express';
import { IPostOutput } from '../models/posts/output.types';
import { HTTP_STATUSES, IOutputModel } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreatePost, IUpdatePost } from '../models/posts/input.types';
import { BlogRepository } from '../repositories/blogs.repository';
import { postsInputModelValidation } from '../validators/posts.validator';
import { IPostDB } from '../models/db/db.types';
import { ObjectId } from 'mongodb';
import { PostService } from '../services/posts.service';
import { IQueryPostData } from '../models/posts/query.types';

export const postsRouter = Router();

postsRouter.get(
  '/',
  async (
    req: Request<unknown, unknown, unknown, IQueryPostData>,
    res: Response<IOutputModel<IPostOutput>>
  ) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;
    const posts = await PostService.getAll({ pageNumber, pageSize, sortBy, sortDirection });
    return res.send(posts);
  }
);
postsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response<IPostOutput>) => {
  const { id } = req.params;
  const post = await PostService.getItemById(id);
  if (post) return res.send(post);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
postsRouter.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = await PostService.removeItemById(id);
  if (!isDeleted) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
postsRouter.post(
  '/',
  authMiddleware,
  postsInputModelValidation(),
  async (req: Request<unknown, unknown, ICreatePost>, res: Response<IPostOutput>) => {
    const { blogId, content, shortDescription, title } = req.body;

    const post = await PostService.createItem({ blogId, content, shortDescription, title });
    if (post) return res.status(HTTP_STATUSES.CREATED_201).send(post);
    else return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }
);
postsRouter.put(
  '/:id',
  authMiddleware,
  postsInputModelValidation(),
  async (req: Request<{ id: string }, unknown, IUpdatePost>, res: Response<IPostOutput>) => {
    const { blogId, content, shortDescription, title } = req.body;
    const { id } = req.params;

    const isUpdate = await PostService.updateItem(id, { blogId, content, shortDescription, title });
    if (!isUpdate) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);
