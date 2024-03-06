import { WithId } from 'mongodb';
import { IUserDB } from '../../db/db.types';
import { IMeUserOutput, IUserOutput } from '../output.types';

export const usersMapper = (user: WithId<IUserDB>): IUserOutput => {
  return {
    createdAt: user.createdAt,
    email: user.email,
    login: user.login,
    id: user._id.toString(),
  };
};

export const meUserMapper = (user: WithId<IUserDB>): IMeUserOutput => {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
};
