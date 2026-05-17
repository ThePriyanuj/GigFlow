import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserEntity } from '../../../domain/entities/User';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements IUserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    const doc = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });

    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map(this.toEntity);
  }

  private toEntity(doc: any): UserEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
