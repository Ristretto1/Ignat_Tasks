import bcrypt from 'bcrypt';

export class HashServise {
  static async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
