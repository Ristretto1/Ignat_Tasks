import { ObjectId } from 'bson';
import { postCollection } from '../db/db';
import { IPostDB } from '../models/db/db.types';
import { IPostOutput } from '../models/posts/output.types';
import { postMapper } from '../models/posts/postMapper/postMapper';
import { IUpdatePost } from '../models/posts/input.types';
import { IOutputModel } from '../models/common.types';
import { IQueryPostData } from '../models/posts/query.types';

export class PostRepository {
  static async getAll(sortData: IQueryPostData): Promise<IOutputModel<IPostOutput>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortData;
    const filter = {};

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
  static async getItemById(id: string): Promise<IPostOutput | null> {
    const currentItem = await postCollection.findOne({ _id: new ObjectId(id) });
    if (currentItem) return postMapper(currentItem);
    return null;
  }
  static async removeItemById(id: string): Promise<boolean> {
    const res = postCollection.deleteOne({ _id: new ObjectId(id) });
    return !!(await res).deletedCount;
  }
  static async createItem(data: IPostDB): Promise<string> {
    const res = await postCollection.insertOne(data);
    return res.insertedId.toString();
  }
  static async updateItem(id: string, data: IUpdatePost): Promise<boolean> {
    const res = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: data.content,
          blogId: data.blogId,
          title: data.title,
          shortDescription: data.shortDescription,
        },
      }
    );
    return !!res.matchedCount;
  }
}
