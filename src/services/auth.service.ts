import { ILoginInputData } from '../models/auth/auth.types';
import { AuthRepository } from '../repositories/auth.repository';
import bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { ITokenOutput } from '../models/common.types';

export class AuthService {
  static async login(data: ILoginInputData): Promise<ITokenOutput | null> {
    const res = await AuthRepository.login(data.loginOrEmail);
    if (!res) return null;

    const isPasswordValid = await bcrypt.compare(data.password, res.hash);
    if (!isPasswordValid) return null;

    const token = await TokenService.createToken({ userId: res.id });
    return { accessToken: token };
  }
}
