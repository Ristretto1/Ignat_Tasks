import { ObjectId } from 'bson';
import { blogCollection, postCollection } from '../../db/db';
import { IBlogOutput } from '../../models/blogs/output.types';
import { IBlogDB, IPostDB } from '../../models/db/db.types';

export class BlogRepository {
  static async createPostsByBlogId(id: string, data: IPostDB): Promise<string> {
    const res = await postCollection.insertOne(data);
    return res.insertedId.toString();
  }
  static async removeBlogById(id: string): Promise<boolean> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
  static async createBlog(data: IBlogDB): Promise<IBlogOutput> {
    const res = await blogCollection.insertOne(data);
    return {
      createdAt: data.createdAt,
      description: data.description,
      id: res.insertedId.toString(),
      isMembership: data.isMembership,
      name: data.name,
      websiteUrl: data.websiteUrl,
    };
  }
  static async updateBlog(id: string, data: IBlogDB): Promise<boolean> {
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
