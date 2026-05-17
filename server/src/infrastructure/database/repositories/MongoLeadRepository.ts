import { ILeadRepository, PaginatedResult } from '../../../domain/repositories/ILeadRepository';
import { LeadEntity } from '../../../domain/entities/Lead';
import { LeadModel } from '../models/LeadModel';
import { ILeadFilters, LeadStatus } from '../../../shared/types/lead.types';
import mongoose from 'mongoose';

export class MongoLeadRepository implements ILeadRepository {
  async create(lead: LeadEntity): Promise<LeadEntity> {
    const doc = await LeadModel.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      value: lead.value,
      notes: lead.notes,
      assignedTo: lead.assignedTo ? new mongoose.Types.ObjectId(lead.assignedTo) : undefined,
      createdBy: new mongoose.Types.ObjectId(lead.createdBy),
    });

    return this.toEntity(doc);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await LeadModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filters: ILeadFilters): Promise<PaginatedResult<LeadEntity>> {
    const query: any = {};

    // Dynamic filtering
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.source) {
      query.source = filters.source;
    }

    // Regex search across name, email, company
    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit; // SkipCount = (PageNumber - 1) × Limit

    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, totalItems] = await Promise.all([
      LeadModel.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      LeadModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map(this.toEntity),
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  async update(id: string, lead: Partial<LeadEntity>): Promise<LeadEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await LeadModel.findByIdAndUpdate(id, { $set: lead }, { new: true, runValidators: true });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await LeadModel.findByIdAndDelete(id);
    return !!result;
  }

  async getStats(): Promise<{
    totalLeads: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    totalValue: number;
    conversionRate: number;
  }> {
    const [totalLeads, statusAgg, sourceAgg, valueAgg, wonCount] = await Promise.all([
      LeadModel.countDocuments(),
      LeadModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      LeadModel.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      LeadModel.aggregate([{ $group: { _id: null, total: { $sum: '$value' } } }]),
      LeadModel.countDocuments({ status: LeadStatus.QUALIFIED }),
    ]);

    const byStatus: Record<string, number> = {};
    statusAgg.forEach((s: any) => { byStatus[s._id] = s.count; });

    const bySource: Record<string, number> = {};
    sourceAgg.forEach((s: any) => { bySource[s._id] = s.count; });

    const totalValue = valueAgg[0]?.total || 0;
    const conversionRate = totalLeads > 0 ? (wonCount / totalLeads) * 100 : 0;

    return { totalLeads, byStatus, bySource, totalValue, conversionRate };
  }

  async findAllForExport(filters: Omit<ILeadFilters, 'page' | 'limit'>): Promise<LeadEntity[]> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;
    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    const docs = await LeadModel.find(query).sort({ [sortBy]: sortOrder }).lean();
    return docs.map(this.toEntity);
  }

  private toEntity(doc: any): LeadEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      company: doc.company,
      status: doc.status,
      source: doc.source,
      value: doc.value,
      notes: doc.notes,
      assignedTo: doc.assignedTo?.toString(),
      createdBy: doc.createdBy?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
