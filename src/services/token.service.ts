import jwt from 'jsonwebtoken';
import { SETTINGS } from '../settings/settings';

export class TokenService {
  static createToken(payload: any): string {
    return jwt.sign(payload, SETTINGS.SECRET_KEY, { expiresIn: '1h' });
  }
  static async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, SETTINGS.SECRET_KEY);
    } catch (e) {
      console.log('token error');
      return null;
    }
  }
}
