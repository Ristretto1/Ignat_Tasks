import { ILoginInputData } from '../models/auth/auth.types';
import { AuthRepository } from '../repositories/auth.repository';
import bcrypt from 'bcrypt';

export class AuthService {
  static async login(data: ILoginInputData): Promise<boolean> {
    const hash = await AuthRepository.login(data.loginOrEmail);
    if (!hash) return false;
    return await bcrypt.compare(data.password, hash);
  }
}
