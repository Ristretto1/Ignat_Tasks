import { WithId } from 'mongodb';
import { IPostDB } from '../../db/db.types';
import { IPostOutput } from '../output.types';

export const postMapper = (postDb: WithId<IPostDB>): IPostOutput => {
  return {
    blogId: postDb.blogId,
    blogName: postDb.blogName,
    content: postDb.content,
    id: postDb._id.toString(),
    shortDescription: postDb.shortDescription,
    title: postDb.title,
    createdAt: postDb.createdAt,
  };
};
