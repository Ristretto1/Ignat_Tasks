import { userCollection } from '../db/db';
import { ILoginInputData } from '../models/auth/auth.types';

export class AuthRepository {
  static async login(loginOrEmail: string): Promise<string | null> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    if (!user) return null;
    return user.hash;
  }
}
