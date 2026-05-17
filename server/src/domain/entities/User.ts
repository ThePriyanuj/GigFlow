// Domain Layer - User Entity
import { UserRole } from '../../shared/types/auth.types';

export interface UserEntity {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole = UserRole.SALES,
    public readonly id?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: UserEntity): User {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    return new User(
      props.name.trim(),
      props.email.toLowerCase().trim(),
      props.password,
      props.role,
      props.id,
      props.createdAt,
      props.updatedAt,
    );
  }
}
