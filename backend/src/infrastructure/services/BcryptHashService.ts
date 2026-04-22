import { IHashService } from '../../application/services/IHashService';
import bcrypt from 'bcrypt';

export class BcryptHashService implements IHashService {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
