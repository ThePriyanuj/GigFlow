import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';
import { UserRole, ITokenPayload, IAuthResponse } from '../../shared/types/auth.types';
import { RegisterDTO, LoginDTO } from '../validation/schemas';

export class AuthUseCase {
  constructor(private userRepo: IUserRepository) {}

  async register(dto: RegisterDTO): Promise<IAuthResponse> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = User.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || UserRole.SALES,
    });

    const created = await this.userRepo.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });

    const token = this.generateToken({
      userId: created.id!,
      email: created.email,
      role: created.role,
    });

    return {
      success: true,
      token,
      user: {
        _id: created.id!,
        name: created.name,
        email: created.email,
        role: created.role,
        createdAt: created.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: created.updatedAt?.toISOString() || new Date().toISOString(),
      },
    };
  }

  async login(dto: LoginDTO): Promise<IAuthResponse> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      token,
      user: {
        _id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      },
    };
  }

  async getProfile(userId: string): Promise<Omit<IAuthResponse, 'token'>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user: {
        _id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      },
    };
  }

  private generateToken(payload: ITokenPayload): string {
    const secret = process.env.JWT_SECRET || 'gigflow-secret-key';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }
}
