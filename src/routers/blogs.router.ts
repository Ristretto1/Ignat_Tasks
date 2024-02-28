import { Router, Request, Response } from 'express';
import { HTTP_STATUSES, IOutputModel } from '../models/common.types';
import { authMiddleware } from '../middlewares/auth/auth.middleware';
import { ICreateBlog, ICreatePostByBlogId, IUpdateBlog } from '../models/blogs/input.types';
import { IBlogOutput } from '../models/blogs/output.types';
import { blogsInputModelValidation, postInBlogInputModelValidation } from '../validators/blogs.validator';
import { BlogService } from '../services/blogs.service';
import { IQueryBlogData } from '../models/blogs/query.types';
import { IQueryPostData } from '../models/posts/query.types';
import { IPostOutput } from '../models/posts/output.types';
import { BlogQueryRepository } from '../repositories/blogs/blogs.query.repo';
import { ObjectId } from 'mongodb';

export const blogsRouter = Router();

blogsRouter.get(
  '/',
  async (req: Request<unknown, unknown, unknown, IQueryBlogData>, res: Response<IOutputModel<IBlogOutput>>) => {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = req.query;
    const sortData: IQueryBlogData = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 10,
      searchNameTerm: searchNameTerm ?? null,
      sortBy: sortBy ?? 'createdAt',
      sortDirection: sortDirection ?? 'desc',
    };

    const blogs = await BlogQueryRepository.getAll(sortData);
    return res.send(blogs);
  }
);

blogsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response<IBlogOutput>) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

  const blog = await BlogQueryRepository.getBlogById(id);
  if (blog) return res.send(blog);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.get(
  '/:id/posts',
  async (req: Request<{ id: string }, unknown, unknown, IQueryPostData>, res: Response<IOutputModel<IPostOutput>>) => {
    const { id } = req.params;
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;

    if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    const currentBlog = await BlogQueryRepository.getBlogById(id);
    if (!currentBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const sortData: IQueryPostData = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 10,
      sortBy: sortBy ?? 'createdAt',
      sortDirection: sortDirection ?? 'desc',
    };

    const blogs = await BlogQueryRepository.getPostsByBlogId(id, sortData);
    if (blogs) return res.send(blogs);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);

blogsRouter.post(
  '/:id/posts',
  authMiddleware,
  postInBlogInputModelValidation(),
  async (req: Request<{ id: string }, unknown, ICreatePostByBlogId>, res: Response<IPostOutput>) => {
    const { id } = req.params;
    const { content, shortDescription, title } = req.body;

    const blogs = await BlogService.createPostsByBlogId(id, { content, shortDescription, title });
    if (blogs) return res.status(HTTP_STATUSES.CREATED_201).send(blogs);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);

blogsRouter.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = await BlogService.removeBlogById(id);
  if (isDeleted) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.post(
  '/',
  authMiddleware,
  blogsInputModelValidation(),
  async (req: Request<unknown, unknown, ICreateBlog>, res: Response<IBlogOutput>) => {
    const { name, description, websiteUrl } = req.body;

    const blog = await BlogService.createBlog({ name, description, websiteUrl });
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

    const isUpdate = await BlogService.updateBlog(id, { description, name, websiteUrl });
    if (isUpdate) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);
