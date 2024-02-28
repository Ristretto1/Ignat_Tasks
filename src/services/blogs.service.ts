import { ObjectId } from 'bson';
import { IBlogOutput } from '../models/blogs/output.types';
import { IBlogDB, IPostDB } from '../models/db/db.types';
import { BlogRepository } from '../repositories/blogs/blogs.repository';
import { ICreateBlog, ICreatePostByBlogId, IUpdateBlog } from '../models/blogs/input.types';
import { IPostOutput } from '../models/posts/output.types';
import { BlogQueryRepository } from '../repositories/blogs/blogs.query.repo';
import { PostQueryRepository } from '../repositories/posts/posts.query.repo';

export class BlogService {
  static async createPostsByBlogId(id: string, data: ICreatePostByBlogId): Promise<IPostOutput | null> {
    if (!ObjectId.isValid(id)) return null;

    const currentBlog = await BlogQueryRepository.getBlogById(id);
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
    return await PostQueryRepository.getPostById(currentIndex);
  }
  static async removeBlogById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    return await BlogRepository.removeBlogById(id);
  }
  static async createBlog(data: ICreateBlog): Promise<IBlogOutput> {
    const dataForNewBlog: IBlogDB = {
      description: data.description,
      name: data.name,
      websiteUrl: data.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    return await BlogRepository.createBlog(dataForNewBlog);
  }
  static async updateBlog(id: string, data: IUpdateBlog): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const blog = await BlogQueryRepository.getBlogById(id);
    if (!blog) return false;

    const dataForUpdate: IBlogDB = {
      description: data.description,
      name: data.name,
      websiteUrl: data.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
    };
    return await BlogRepository.updateBlog(id, dataForUpdate);
  }
}
