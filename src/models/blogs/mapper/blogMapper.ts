import { WithId } from 'mongodb';
import { IBlogDB } from '../../db/db.types';
import { IBlogOutput } from '../output.types';

export const blogMapper = (blogDb: WithId<IBlogDB>): IBlogOutput => {
  return {
    description: blogDb.description,
    id: blogDb._id.toString(),
    name: blogDb.name,
    websiteUrl: blogDb.websiteUrl,
    createdAt: blogDb.createdAt,
    isMembership: blogDb.isMembership,
  };
};
