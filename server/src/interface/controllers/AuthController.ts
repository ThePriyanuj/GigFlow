import { Request, Response } from 'express';
import { AuthUseCase } from '../../application/usecases/AuthUseCase';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';

const userRepo = new MongoUserRepository();
const authUseCase = new AuthUseCase(userRepo);

export class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 2
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *               role:
   *                 type: string
   *                 enum: [admin, sales]
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: User already exists
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authUseCase.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const status = error.message.includes('already exists') ? 409 : 400;
      res.status(status).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authUseCase.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile
   *       401:
   *         description: Unauthorized
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const result = await authUseCase.getProfile(req.user!.userId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
}
