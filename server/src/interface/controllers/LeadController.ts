import { Request, Response } from 'express';
import { format } from '@fast-csv/format';
import { LeadUseCase } from '../../application/usecases/LeadUseCase';
import { MongoLeadRepository } from '../../infrastructure/database/repositories/MongoLeadRepository';

const leadRepo = new MongoLeadRepository();
const leadUseCase = new LeadUseCase(leadRepo);

export class LeadController {
  /**
   * @swagger
   * /api/leads:
   *   post:
   *     summary: Create a new lead
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, company, source]
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               company:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [New, Contacted, Qualified, Lost]
   *               source:
   *                 type: string
   *                 enum: [Website, Instagram, Referral]
   *               value:
   *                 type: number
   *               notes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Lead created
   *       400:
   *         description: Validation error
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadUseCase.create(req.body, req.user!.userId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/leads:
   *   get:
   *     summary: Get all leads with filtering and pagination
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [New, Contacted, Qualified, Lost]
   *       - in: query
   *         name: source
   *         schema:
   *           type: string
   *           enum: [Website, Instagram, Referral]
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           default: createdAt
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: List of leads
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadUseCase.getAll(req.query as any);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/leads/stats:
   *   get:
   *     summary: Get lead statistics
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lead statistics
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadUseCase.getStats();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/leads/export:
   *   get:
   *     summary: Export leads as CSV
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *       - in: query
   *         name: source
   *         schema:
   *           type: string
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: CSV file download
   *         content:
   *           text/csv:
   *             schema:
   *               type: string
   */
  static async exportCsv(req: Request, res: Response): Promise<void> {
    try {
      const data = await leadUseCase.getExportData(req.query as any);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');

      res.write('\uFEFF'); // Write BOM first to force Excel into UTF-8 mode

      const csvStream = format({ headers: true });
      csvStream.pipe(res);

      for (const row of data) {
        csvStream.write(row);
      }

      csvStream.end();
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }


  /**
   * @swagger
   * /api/leads/{id}:
   *   get:
   *     summary: Get a lead by ID
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lead details
   *       404:
   *         description: Lead not found
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadUseCase.getById(req.params.id as string);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/leads/{id}:
   *   put:
   *     summary: Update a lead
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *               company:
   *                 type: string
   *               status:
   *                 type: string
   *               source:
   *                 type: string
   *               value:
   *                 type: number
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lead updated
   *       404:
   *         description: Lead not found
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadUseCase.update(req.params.id as string, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/leads/{id}:
   *   delete:
   *     summary: Delete a lead
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lead deleted
   *       404:
   *         description: Lead not found
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await leadUseCase.delete(req.params.id as string);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
}
