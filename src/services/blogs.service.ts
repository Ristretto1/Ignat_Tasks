import { ObjectId } from 'bson';
import { IBlogOutput } from '../models/blogs/output.types';
import { IBlogDB } from '../models/db/db.types';
import { BlogRepository } from '../repositories/blogs.repository';
import { ICreateBlog, IUpdateBlog } from '../models/blogs/input.types';

export class BlogService {
  static async getAll(): Promise<IBlogOutput[]> {
    const blogs = await BlogRepository.getAll();
    return blogs;
  }
  static async getItemById(id: string): Promise<IBlogOutput | null> {
    const blog = await BlogRepository.getItemById(id);
    return blog;
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
