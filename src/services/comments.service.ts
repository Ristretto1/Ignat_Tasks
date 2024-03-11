import { IUpdateComment } from '../models/comments/input.types';
import { ICommentUpdateModel } from '../models/comments/models.types';
import { CommentQueryRepository } from '../repositories/comments/comments.query.repo';
import { CommentRepository } from '../repositories/comments/comments.repository';

export class CommentService {
  static async removeCommentById(id: string): Promise<boolean> {
    return await CommentRepository.removeCommentById(id);
  }
  static async updateCommentById(id: string, data: IUpdateComment): Promise<boolean> {
    const comment = await CommentQueryRepository.getCommentById(id);
    if (!comment) return false;


    const dataForUpdate: ICommentUpdateModel = {
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      content: data.content,
      createdAt: comment.createdAt,
    };
    return await CommentRepository.updateCommentById(id, dataForUpdate);
  }
}
