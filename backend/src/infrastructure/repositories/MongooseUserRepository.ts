import { IUserRepository, UserFilters } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../database/models/UserModel';
import { UserMapper } from '../mappers/UserMapper';

export class MongooseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const document = await UserModel.findById(id).exec();
    if (!document) return null;
    return UserMapper.toDomain(document);
  }

  async findByEmailid(emailid: string): Promise<User | null> {
    const document = await UserModel.findOne({ emailid }).exec();
    if (!document) return null;
    return UserMapper.toDomain(document);
  }

  async save(user: User): Promise<void> {
    const persistenceData = UserMapper.toPersistence(user);
    const document = new UserModel(persistenceData);
    await document.save();
  }

  async update(user: User): Promise<void> {
    const persistenceData = UserMapper.toPersistence(user);
    // Destructure _id out so we don't try to overwrite the immutable _id field during update
    const { _id, ...updateData } = persistenceData;
    await UserModel.findByIdAndUpdate(user.id, updateData,{ new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }

  async findAll(filters?: UserFilters): Promise<User[]> {
    const query: any = {};
    if (filters?.role) {
      query.role = filters.role;
    }
    const documents = await UserModel.find(query).exec();
    return documents.map(doc => UserMapper.toDomain(doc));
  }
}
