import { ObjectId } from 'bson';
import { postCollection } from '../db/db';
import { IPostDB } from '../models/db/db.types';
import { IPostOutput } from '../models/posts/output.types';
import { postMapper } from '../models/posts/postMapper/postMapper';
import { ICreatePost, IUpdatePost } from '../models/posts/input.types';
import { PostRepository } from '../repositories/posts.repository';
import { BlogRepository } from '../repositories/blogs.repository';
import { IOutputModel } from '../models/common.types';
import { IQueryPostData } from '../models/posts/query.types';

export class PostService {
  static async getAll(data: IQueryPostData): Promise<IOutputModel<IPostOutput>> {
    const sortData: IQueryPostData = {
      pageNumber: data.pageNumber ?? 1,
      pageSize: data.pageSize ?? 10,
      sortBy: data.sortBy ?? 'createdAt',
      sortDirection: data.sortDirection ?? 'desc',
    };
    const posts = await PostRepository.getAll(sortData);
    return posts;
  }
  static async getItemById(id: string): Promise<IPostOutput | null> {
    if (!ObjectId.isValid(id)) return null;
    const currentItem = await PostRepository.getItemById(id);
    if (currentItem) return currentItem;
    return null;
  }
  static async removeItemById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    return await PostRepository.removeItemById(id);
  }
  static async createItem(data: ICreatePost): Promise<IPostOutput | null> {
    const currentBlog = await BlogRepository.getItemById(data.blogId);
    if (!currentBlog) return null;

    const postModel: IPostDB = {
      blogId: data.blogId,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
      blogName: currentBlog.name,
      createdAt: new Date().toISOString(),
    };

    const currentIndex = await PostRepository.createItem(postModel);
    const item = await this.getItemById(currentIndex);
    return item;
  }
  static async updateItem(id: string, data: IUpdatePost): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const postModel: IUpdatePost = {
      blogId: data.blogId,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
    };
    return await PostRepository.updateItem(id, postModel);
  }
}
