import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/db';
import { IOutputModel } from '../../models/common.types';
import { meUserMapper, usersMapper } from '../../models/users/mapper/usersMapper';
import { IMeUserOutput, IUserOutput } from '../../models/users/output.types';
import { IQueryUserData } from '../../models/users/query.types';

export class UserQueryRepository {
  static async getAll(data: IQueryUserData): Promise<IOutputModel<IUserOutput>> {
    let { pageNumber, pageSize, searchEmailTerm, searchLoginTerm, sortBy, sortDirection } = data;
    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);

    let filter = {};
    const emailFilter = { email: { $regex: searchEmailTerm, $options: 'i' } };
    const loginFilter = { login: { $regex: searchLoginTerm, $options: 'i' } };
    if (searchEmailTerm) filter = emailFilter;
    if (searchLoginTerm) filter = loginFilter;
    if (searchLoginTerm && searchEmailTerm) filter = { $or: [emailFilter, loginFilter] };

    const users = await userCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map(usersMapper),
    };
  }
  static async getUserById(id: string): Promise<IMeUserOutput> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return meUserMapper(user!);
  }
}
