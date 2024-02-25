import { Router, Request, Response } from 'express';
import { BlogRepository } from '../repositories/blogs.repository';
import { HTTP_STATUSES } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreateBlog, IUpdateBlog } from '../models/blogs/input.types';
import { IBlogOutput } from '../models/blogs/output.types';
import { blogsInputModelValidation } from '../validators/blogs.validator';
import { IBlogDB } from '../models/db/db.types';
import { ObjectId } from 'mongodb';

export const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response<IBlogOutput[]>) => {
  const blogs: IBlogOutput[] = await BlogRepository.getAll();
  return res.send(blogs);
});

blogsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response<IBlogOutput>) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  const blog = await BlogRepository.getItemById(id);
  if (blog) return res.send(blog);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  const isDeleted = await BlogRepository.removeItemById(id);
  if (isDeleted) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.post(
  '/',
  authMiddleware,
  blogsInputModelValidation(),
  async (req: Request<unknown, unknown, ICreateBlog>, res: Response<IBlogOutput>) => {
    const { name, description, websiteUrl } = req.body;

    const dataForNewItem: IBlogDB = {
      description,
      name,
      websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blog = await BlogRepository.createItem(dataForNewItem);
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
    if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    const blog = await BlogRepository.getItemById(id);
    if (!blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const dataForNewItem: IBlogDB = {
      description,
      name,
      websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
    };

    const isUpdate = await BlogRepository.updateItem(id, dataForNewItem);
    if (isUpdate) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);
