import { ObjectId } from 'bson';
import { IBlogOutput } from '../models/blogs/output.types';
import { IBlogDB, IPostDB } from '../models/db/db.types';
import { BlogRepository } from '../repositories/blogs.repository';
import { ICreateBlog, ICreatePostByBlogId, IUpdateBlog } from '../models/blogs/input.types';
import { IQueryBlogData } from '../models/blogs/query.types';
import { IOutputModel } from '../models/common.types';
import { IQueryPostData } from '../models/posts/query.types';
import { IPostOutput } from '../models/posts/output.types';
import { PostService } from './posts.service';

export class BlogService {
  static async getAll(data: IQueryBlogData): Promise<IOutputModel<IBlogOutput>> {
    const sortData: IQueryBlogData = {
      pageNumber: data.pageNumber ?? 1,
      pageSize: data.pageSize ?? 10,
      searchNameTerm: data.searchNameTerm ?? null,
      sortBy: data.sortBy ?? 'createdAt',
      sortDirection: data.sortDirection ?? 'desc',
    };

    return await BlogRepository.getAll(sortData);
  }
  static async getItemById(id: string): Promise<IBlogOutput | null> {
    if (!ObjectId.isValid(id)) return null;
    const blog = await BlogRepository.getItemById(id);
    return blog;
  }
  static async getPostsByBlogId(
    id: string,
    data: IQueryPostData
  ): Promise<IOutputModel<IPostOutput> | null> {
    if (!ObjectId.isValid(id)) return null;
    const currentBlog = this.getItemById(id);
    if (!currentBlog) return null;

    const sortData: IQueryPostData = {
      pageNumber: data.pageNumber ?? 1,
      pageSize: data.pageSize ?? 10,
      sortBy: data.sortBy ?? 'createdAt',
      sortDirection: data.sortDirection ?? 'desc',
    };

    return await BlogRepository.getPostsByBlogId(sortData);
  }
  static async createPostsByBlogId(
    id: string,
    data: ICreatePostByBlogId
  ): Promise<IPostOutput | null> {
    if (!ObjectId.isValid(id)) return null;

    const currentBlog = await this.getItemById(id);
    if (!currentBlog) return null;

    const postModel: IPostDB = {
      blogId: id,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
      blogName: currentBlog.name,
      createdAt: new Date().toISOString(),
    };

    const currentIndex = await BlogRepository.createPostsByBlogId(id, postModel);
    return await PostService.getItemById(currentIndex);
  }
  static async removeItemById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    return await BlogRepository.removeItemById(id);
  }
  static async createItem(data: ICreateBlog): Promise<IBlogOutput | null> {
    const dataForNewItem: IBlogDB = {
      description: data.description,
      name: data.name,
      websiteUrl: data.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const createdItemIndex = await BlogRepository.createItem(dataForNewItem);
    const item = await this.getItemById(createdItemIndex);
    return item;
  }
  static async updateItem(id: string, data: IUpdateBlog): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const blog = await this.getItemById(id);
    if (!blog) return false;

    const dataForUpdate: IBlogDB = {
      description: data.description,
      name: data.name,
      websiteUrl: data.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
    };
    return await BlogRepository.updateItem(id, dataForUpdate);
  }
}
