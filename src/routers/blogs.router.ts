import { Router, Request, Response } from 'express';
import { BlogRepository } from '../repositories/blogs.repository';
import { HTTP_STATUSES } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreateBlog, IUpdateBlog } from '../models/blogs/input.types';
import { IBlogOutput } from '../models/blogs/output.types';
import { IBlogDB } from '../models/blogs/blogs.types';
import { blogsInputModelValidation } from '../validators/blogs.validator';

export const blogsRouter = Router();

blogsRouter.get('/', (req: Request, res: Response<IBlogOutput[]>) => {
  const blogs: IBlogOutput[] = BlogRepository.getAll();
  return res.send(blogs);
});

blogsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<IBlogOutput>) => {
  const { id } = req.params;
  const blog = BlogRepository.getItemById(id);
  if (blog) return res.send(blog);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.delete('/:id', authMiddleware, (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = BlogRepository.removeItemById(id);
  if (isDeleted) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.post(
  '/',
  authMiddleware,
  blogsInputModelValidation(),
  (req: Request<unknown, unknown, ICreateBlog>, res: Response<IBlogOutput>) => {
    const { name, description, websiteUrl } = req.body;

    const newBlog: IBlogDB = {
      id: Date.now().toString(),
      description,
      name,
      websiteUrl,
    };

    const blog = BlogRepository.createItem(newBlog);
    return res.status(HTTP_STATUSES.CREATED_201).send(blog);
  }
);

blogsRouter.put(
  '/:id',
  authMiddleware,
  blogsInputModelValidation(),
  (req: Request<{ id: string }, unknown, IUpdateBlog>, res: Response) => {
    const { description, name, websiteUrl } = req.body;
    const { id } = req.params;
    const blog = BlogRepository.getItemById(id);
    if (!blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const updateData: IBlogDB = {
      id: blog.id,
      description,
      name,
      websiteUrl,
    };

    const isUpdate = BlogRepository.updateItem(id, updateData);
    if (isUpdate) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);
