import { ObjectId } from 'bson';
import { postCollection } from '../../db/db';
import { IPostDB } from '../../models/db/db.types';
import { IPostOutput } from '../../models/posts/output.types';
import { IUpdatePost } from '../../models/posts/input.types';

export class PostRepository {
  static async removePostById(id: string): Promise<boolean> {
    const res = postCollection.deleteOne({ _id: new ObjectId(id) });
    return !!(await res).deletedCount;
  }
  static async createPost(data: IPostDB): Promise<IPostOutput> {
    const res = await postCollection.insertOne(data);
    return {
      blogId: data.blogId,
      blogName: data.blogName,
      content: data.content,
      createdAt: data.createdAt,
      id: res.insertedId.toString(),
      shortDescription: data.shortDescription,
      title: data.title,
    };
  }
  static async updatePost(id: string, data: IUpdatePost): Promise<boolean> {
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
