import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Project } from '../../domain/entities/Project';
import { User } from '../../domain/entities/User';
import { ProjectModel, IProjectDocument } from '../database/models/ProjectModel';
import { ProjectMapper } from '../mappers/ProjectMapper';
import { UserModel } from '../database/models/UserModel';
import { UserMapper } from '../mappers/UserMapper';

export class MongooseProjectRepository implements IProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const document = await ProjectModel.findById(id)
    .populate('pmId', 'name email') 
    .populate('teamMemberIds', 'name email') 
    .exec();
    if (!document) return null;
    return ProjectMapper.toDomain(document);
  }

  async save(project: Project): Promise<void> {
    const persistenceData = ProjectMapper.toPersistence(project);
    const document = new ProjectModel(persistenceData);
    await document.save();
  }

  async update(project: Project): Promise<void> {
    const persistenceData = ProjectMapper.toPersistence(project);
    const { _id, ...updateData } = persistenceData;
    await ProjectModel.findByIdAndUpdate(project.id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await ProjectModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<Project[]> {
    const documents = await ProjectModel.find()
      .populate('pmId', 'name email') 
      .populate('teamMemberIds', 'name email') 
      .exec();
      
    return documents.map(doc => ProjectMapper.toDomain(doc));
  }

  async findByPmId(pmId: string): Promise<Project[]> {
    const documents = await ProjectModel.find({ pmId })
      .populate('pmId', 'name email')
      .populate('teamMemberIds', 'name email')
      .exec();
      
    return documents.map(doc => ProjectMapper.toDomain(doc));
  }

  async getTeamMembers(projectId: string): Promise<User[]> {
    const projectDoc = await ProjectModel.findById(projectId).exec();
    if (!projectDoc || !projectDoc.teamMemberIds.length) return [];
    
    const userDocs = await UserModel.find({ _id: { $in: projectDoc.teamMemberIds } }).exec();
    return userDocs.map(doc => UserMapper.toDomain(doc as any));
  }
}
