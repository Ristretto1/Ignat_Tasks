import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/db';
import { IUserOutput } from '../../models/users/output.types';
import { IUserDB } from '../../models/db/db.types';

export class UserRepository {
  static async removeUser(id: string): Promise<boolean> {
    const res = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
  static async createUser(data: IUserDB): Promise<IUserOutput> {
    const res = await userCollection.insertOne(data);

    return {
      createdAt: data.createdAt,
      email: data.email,
      id: res.insertedId.toString(),
      login: data.login,
    };
  }
}
