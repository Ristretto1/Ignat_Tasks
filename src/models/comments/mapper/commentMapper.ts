import { WithId } from 'mongodb';
import { ICommentDB } from '../../db/db.types';
import { ICommentOutput } from '../output.types';

export const commentMapper = (commentDb: WithId<ICommentDB>): ICommentOutput => {
  return {
    id: commentDb._id.toString(),
    commentatorInfo: {
      userId: commentDb.commentatorInfo.userId,
      userLogin: commentDb.commentatorInfo.userLogin,
    },
    content: commentDb.content,
    createdAt: commentDb.createdAt,
  };
};
