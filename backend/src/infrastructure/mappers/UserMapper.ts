import { User } from '../../domain/entities/User';
import { IUserDocument } from '../database/models/UserModel';

export class UserMapper {
  /**
   * Converts a Mongoose document to a Domain User entity.
   */
  public static toDomain(raw: IUserDocument): User {
    return new User(
      raw._id,
      raw.name,
      raw.emailid,
      raw.passwordHash,
      raw.role
    );
  }

  /**
   * Prepares a Domain User entity for persistence in MongoDB.
   */
  public static toPersistence(user: User): any {
    return {
      _id: user.id, // Optional depending on whether inserting or updating, helps maintain reference
      name: user.name,
      emailid: user.emailid,
      passwordHash: user.passwordHash,
      role: user.role
    };
  }
}
