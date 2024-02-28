import { ObjectId } from 'bson';
import { IPostDB } from '../models/db/db.types';
import { IPostOutput } from '../models/posts/output.types';
import { ICreatePost, IUpdatePost } from '../models/posts/input.types';
import { PostRepository } from '../repositories/posts/posts.repository';

import { BlogQueryRepository } from '../repositories/blogs/blogs.query.repo';

export class PostService {
  static async removePostById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    return await PostRepository.removePostById(id);
  }
  static async createPost(data: ICreatePost): Promise<IPostOutput | null> {
    const currentBlog = await BlogQueryRepository.getBlogById(data.blogId);
    if (!currentBlog) return null;

    const postModel: IPostDB = {
      blogId: data.blogId,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
      blogName: currentBlog.name,
      createdAt: new Date().toISOString(),
    };

    return await PostRepository.createPost(postModel);
  }
  static async updatePost(id: string, data: IUpdatePost): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const postModel: IUpdatePost = {
      blogId: data.blogId,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
    };
    return await PostRepository.updatePost(id, postModel);
  }
}
