import { ObjectId } from 'bson';
import { commentCollection, postCollection } from '../../db/db';
import { ICommentDB, IPostDB } from '../../models/db/db.types';
import { IPostOutput } from '../../models/posts/output.types';
import { IUpdatePost } from '../../models/posts/input.types';
import { ICommentOutput } from '../../models/comments/output.types';

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
  static async createCommentById(data: ICommentDB): Promise<ICommentOutput> {
    const res = await commentCollection.insertOne(data);
    return {
      commentatorInfo: {
        userId: data.commentatorInfo.userId,
        userLogin: data.commentatorInfo.userLogin,
      },
      content: data.content,
      createdAt: data.createdAt,
      id: res.insertedId.toString(),
    };
  }
}
