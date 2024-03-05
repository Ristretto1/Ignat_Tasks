import { ObjectId } from 'mongodb';
import { commentCollection } from '../../db/db';
import { ICommentOutput } from '../../models/comments/output.types';
import { commentMapper } from '../../models/comments/mapper/commentMapper';

export class CommentQueryRepository {
  static async getCommentById(id: string): Promise<ICommentOutput | null> {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (comment) return commentMapper(comment);
    return null;
  }
}
