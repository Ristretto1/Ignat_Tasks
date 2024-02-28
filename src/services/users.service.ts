import { ObjectId } from 'mongodb';
import { IOutputModel } from '../models/common.types';
import { IUserOutput } from '../models/users/output.types';
import { IQueryUserData } from '../models/users/query.types';
import { UserRepository } from '../repositories/users.repository';
import { ICreateUser } from '../models/users/input.types';
import { IUserDB } from '../models/db/db.types';
import bcrypt from 'bcrypt';

export class UserService {
  static async getAll(data: IQueryUserData): Promise<IUserOutput[]> {
    return await UserRepository.getAll(data);
  }

  static async removeUser(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    return await UserRepository.removeUser(id);
  }

  static async createUser(data: ICreateUser): Promise<IUserOutput | null> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const createData: IUserDB = {
      createdAt: new Date().toISOString(),
      email: data.email,
      hash,
      login: data.login,
    };

    return await UserRepository.createUser(createData);
  }
}
