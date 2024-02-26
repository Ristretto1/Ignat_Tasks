import { ObjectId } from 'bson';
import { blogCollection, postCollection } from '../db/db';
import { IBlogOutput } from '../models/blogs/output.types';
import { IBlogDB, IPostDB } from '../models/db/db.types';
import { blogMapper } from '../models/blogs/mapper/blogMapper';
import { IQueryBlogData } from '../models/blogs/query.types';
import { IOutputModel } from '../models/common.types';
import { IQueryPostData } from '../models/posts/query.types';
import { IPostOutput } from '../models/posts/output.types';
import { postMapper } from '../models/posts/postMapper/postMapper';

export class BlogRepository {
  static async getAll(sortData: IQueryBlogData): Promise<IOutputModel<IBlogOutput>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = sortData;
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
  static async getItemById(id: string): Promise<IBlogOutput | null> {
    const currentItem = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!currentItem) return null;
    return blogMapper(currentItem);
  }
  static async getPostsByBlogId(
    id: string,
    data: IQueryPostData
  ): Promise<IOutputModel<IPostOutput> | null> {
    const { pageNumber, pageSize, sortBy, sortDirection } = data;
    let filter = {};

    const blogs = await postCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items: blogs.map(postMapper),
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount,
    };
  }
  static async createPostsByBlogId(id: string, data: IPostDB): Promise<string> {
    const res = await postCollection.insertOne(data);
    return res.insertedId.toString();
  }

  static async removeItemById(id: string): Promise<boolean> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
  static async createItem(data: IBlogDB): Promise<string> {
    const res = await blogCollection.insertOne(data);
    const currentIndex = res.insertedId.toString();
    return currentIndex;
  }
  static async updateItem(id: string, data: IBlogDB): Promise<boolean> {
    const res = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          description: data.description,
          name: data.name,
          websiteUrl: data.websiteUrl,
        },
      }
    );

    return !!res.matchedCount;
  }
}
