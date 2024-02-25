import { Router, Request, Response } from 'express';
import { PostsRepository } from '../repositories/posts.repository';
import { IPostOutput } from '../models/posts/output.types';
import { HTTP_STATUSES } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreateBlog } from '../models/blogs/input.types';
import { ICreatePost, IUpdatePost } from '../models/posts/input.types';
import { BlogRepository } from '../repositories/blogs.repository';
import { postsInputModelValidation } from '../validators/posts.validator';

export const postsRouter = Router();

postsRouter.get('/', (req: Request, res: Response<IPostOutput[]>) => {
  const posts = PostsRepository.getAll();
  return res.send(posts);
});
postsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<IPostOutput>) => {
  const { id } = req.params;
  const post = PostsRepository.getItemById(id);
  if (!post) res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  return res.send(post);
});
postsRouter.delete('/:id', authMiddleware, (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = PostsRepository.removeItemById(id);
  if (!isDeleted) res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
postsRouter.post(
  '/',
  authMiddleware,
  postsInputModelValidation(),
  (req: Request<unknown, unknown, ICreatePost>, res: Response<IPostOutput>) => {
    const { blogId, content, shortDescription, title } = req.body;
    const currentBlog = BlogRepository.getItemById(blogId);
    if (!currentBlog) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

    const postModel: IPostOutput = {
      blogId,
      blogName: currentBlog.name,
      content,
      id: Date.now().toString(),
      shortDescription,
      title,
    };
    const post = PostsRepository.createItem(postModel);
    return res.status(HTTP_STATUSES.CREATED_201).send(post);
  }
);
postsRouter.put(
  '/:id',
  authMiddleware,
  postsInputModelValidation(),
  (req: Request<{ id: string }, unknown, IUpdatePost>, res: Response<IPostOutput>) => {
    const { blogId, content, shortDescription, title } = req.body;
    const { id } = req.params;
    const currentBlog = BlogRepository.getItemById(blogId);
    if (!currentBlog) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

    const postModel: IPostOutput = {
      blogId,
      blogName: currentBlog.name,
      content,
      id: Date.now().toString(),
      shortDescription,
      title,
    };
    const isUpdate = PostsRepository.updateItem(id, postModel);
    if (!isUpdate) res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);
