import { ObjectId } from 'bson';
import { blogCollection, postCollection } from '../../db/db';
import { IBlogOutput } from '../../models/blogs/output.types';
import { blogMapper } from '../../models/blogs/mapper/blogMapper';
import { IQueryBlogData } from '../../models/blogs/query.types';
import { IOutputModel } from '../../models/common.types';
import { IQueryPostData } from '../../models/posts/query.types';
import { IPostOutput } from '../../models/posts/output.types';
import { postMapper } from '../../models/posts/postMapper/postMapper';

export class BlogQueryRepository {
  static async getAll(sortData: IQueryBlogData): Promise<IOutputModel<IBlogOutput>> {
    let { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = sortData;
    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);

    let filter = {};
    if (searchNameTerm) filter = { name: { $regex: searchNameTerm, $options: 'i' } };

    const blogs = await blogCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: blogs.map(blogMapper),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  }
  static async getBlogById(id: string): Promise<IBlogOutput | null> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) return null;
    return blogMapper(blog);
  }
  static async getPostsByBlogId(
    id: string,
    data: IQueryPostData
  ): Promise<IOutputModel<IPostOutput> | null> {
    let { pageNumber, pageSize, sortBy, sortDirection } = data;
    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);
    let filter = { blogId: id };

    const posts = await postCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: posts.map(postMapper),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  }
}
