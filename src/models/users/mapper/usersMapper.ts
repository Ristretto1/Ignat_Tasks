import { WithId } from 'mongodb';
import { IUserDB } from '../../db/db.types';
import { IUserOutput } from '../output.types';

export const usersMapper = (user: WithId<IUserDB>): IUserOutput => {
  return {
    createdAt: user.createdAt,
    email: user.email,
    login: user.login,
    id: user._id.toString(),
  };
};
