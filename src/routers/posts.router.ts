import { Router, Request, Response } from 'express';
import { PostsRepository } from '../repositories/posts.repository';
import { IPostOutput } from '../models/posts/output.types';
import { HTTP_STATUSES } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreatePost, IUpdatePost } from '../models/posts/input.types';
import { BlogRepository } from '../repositories/blogs.repository';
import { postsInputModelValidation } from '../validators/posts.validator';
import { IPostDB } from '../models/db/db.types';
import { ObjectId } from 'mongodb';

export const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response<IPostOutput[]>) => {
  const posts = await PostsRepository.getAll();
  return res.send(posts);
});
postsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response<IPostOutput>) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  const post = await PostsRepository.getItemById(id);
  if (post) return res.send(post);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
postsRouter.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  const isDeleted = await PostsRepository.removeItemById(id);
  if (!isDeleted) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
postsRouter.post(
  '/',
  authMiddleware,
  postsInputModelValidation(),
  async (req: Request<unknown, unknown, ICreatePost>, res: Response<IPostOutput>) => {
    const { blogId, content, shortDescription, title } = req.body;
    const currentBlog = await BlogRepository.getItemById(blogId);
    if (!currentBlog) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

    const postModel: IPostDB = {
      blogId,
      content,
      shortDescription,
      title,
      blogName: currentBlog.name,
      createdAt: new Date().toISOString(),
    };
    const post = await PostsRepository.createItem(postModel);
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
    if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const postModel: IUpdatePost = {
      blogId,
      content,
      shortDescription,
      title,
    };
    const isUpdate = await PostsRepository.updateItem(id, postModel);
    if (!isUpdate) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);
