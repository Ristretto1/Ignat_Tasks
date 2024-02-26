import { Router, Request, Response } from 'express';
import { HTTP_STATUSES } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreateBlog, IUpdateBlog } from '../models/blogs/input.types';
import { IBlogOutput } from '../models/blogs/output.types';
import { blogsInputModelValidation } from '../validators/blogs.validator';
import { BlogService } from '../services/blogs.service';

export const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response<IBlogOutput[]>) => {
  const blogs: IBlogOutput[] = await BlogService.getAll();
  return res.send(blogs);
});

blogsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response<IBlogOutput>) => {
  const { id } = req.params;
  const blog = await BlogService.getItemById(id);
  if (blog) return res.send(blog);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = await BlogService.removeItemById(id);
  if (isDeleted) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.post(
  '/',
  authMiddleware,
  blogsInputModelValidation(),
  async (req: Request<unknown, unknown, ICreateBlog>, res: Response<IBlogOutput>) => {
    const { name, description, websiteUrl } = req.body;

    const blog = await BlogService.createItem({ name, description, websiteUrl });
    if (blog) return res.status(HTTP_STATUSES.CREATED_201).send(blog);
    else return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }
);

blogsRouter.put(
  '/:id',
  authMiddleware,
  blogsInputModelValidation(),
  async (req: Request<{ id: string }, unknown, IUpdateBlog>, res: Response) => {
    const { description, name, websiteUrl } = req.body;
    const { id } = req.params;

    const isUpdate = await BlogService.updateItem(id, { description, name, websiteUrl });
    if (isUpdate) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);
