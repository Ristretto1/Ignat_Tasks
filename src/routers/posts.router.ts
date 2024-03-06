import { Router, Request, Response } from 'express';
import { IPostOutput } from '../models/posts/output.types';
import {
  HTTP_STATUSES,
  IOutputModel,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
} from '../models/common.types';
import { authMiddleware, authTokenMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreatePost, IUpdatePost } from '../models/posts/input.types';
import { postsInputModelValidation } from '../validators/posts.validator';
import { ObjectId } from 'mongodb';
import { PostService } from '../services/posts.service';
import { IQueryPostData } from '../models/posts/query.types';
import { PostQueryRepository } from '../repositories/posts/posts.query.repo';
import { IQueryCommentData } from '../models/comments/query.types';
import { ICreateComment } from '../models/comments/input.types';

export const postsRouter = Router();

postsRouter.get(
  '/',
  async (req: Request<unknown, unknown, unknown, IQueryPostData>, res: Response<IOutputModel<IPostOutput>>) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;
    const sortData: IQueryPostData = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 10,
      sortBy: sortBy ?? 'createdAt',
      sortDirection: sortDirection ?? 'desc',
    };

    const posts = await PostQueryRepository.getAll(sortData);
    return res.send(posts);
  }
);
postsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response<IPostOutput>) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

  const post = await PostQueryRepository.getPostById(id);
  if (post) return res.send(post);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
postsRouter.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = await PostService.removePostById(id);
  if (!isDeleted) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
postsRouter.post(
  '/',
  authMiddleware,
  postsInputModelValidation(),
  async (req: Request<unknown, unknown, ICreatePost>, res: Response<IPostOutput>) => {
    const { blogId, content, shortDescription, title } = req.body;

    const post = await PostService.createPost({ blogId, content, shortDescription, title });
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

    const isUpdate = await PostService.updatePost(id, { blogId, content, shortDescription, title });
    if (!isUpdate) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);
postsRouter.get(
  '/:id/comments',
  async (req: RequestWithParamsAndQuery<{ id: string }, IQueryCommentData>, res: Response) => {
    const { id } = req.params;
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;

    if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const sortData: IQueryCommentData = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 10,
      sortBy: sortBy ?? 'createdAt',
      sortDirection: sortDirection ?? 'desc',
    };

    const comments = await PostQueryRepository.getCommentsByPostId(id, sortData);
    return res.send(comments);
  }
);
postsRouter.post(
  '/:id/comments',
  authTokenMiddleware,
  async (req: RequestWithParamsAndBody<{ id: string }, ICreateComment>, res: Response) => {
    const { userId } = req;
    const { id } = req.params;
    const { content } = req.body;
    if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const comment = await PostService.createCommentById(userId!, id, { content });
    if (comment) return res.status(HTTP_STATUSES.CREATED_201).send(comment);
    else return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }
);
