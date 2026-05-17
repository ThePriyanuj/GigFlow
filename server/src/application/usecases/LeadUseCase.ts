import { ILeadRepository } from '../../domain/repositories';
import { Lead } from '../../domain/entities';
import { CreateLeadDTO, UpdateLeadDTO, LeadFiltersDTO } from '../validation/schemas';
import { IPaginatedResponse, IApiResponse, IStatsResponse } from '../../shared/types/api.types';
import { ILead, LeadStatus } from '../../shared/types/lead.types';

export class LeadUseCase {
  constructor(private leadRepo: ILeadRepository) {}

  async create(dto: CreateLeadDTO, userId: string): Promise<IApiResponse<ILead>> {
    const lead = Lead.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      status: dto.status || LeadStatus.NEW,
      source: dto.source,
      value: dto.value || 0,
      notes: dto.notes,
      createdBy: userId,
    });

    const created = await this.leadRepo.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      value: lead.value,
      notes: lead.notes,
      createdBy: lead.createdBy,
    });

    return {
      success: true,
      data: this.toLeadResponse(created),
      message: 'Lead created successfully',
    };
  }

  async getById(id: string): Promise<IApiResponse<ILead>> {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new Error('Lead not found');
    }

    return {
      success: true,
      data: this.toLeadResponse(lead),
    };
  }

  async getAll(filters: LeadFiltersDTO): Promise<IPaginatedResponse<ILead>> {
    const result = await this.leadRepo.findAll(filters);

    return {
      success: true,
      data: result.data.map(this.toLeadResponse),
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        limit: result.limit,
        hasNextPage: result.currentPage < result.totalPages,
        hasPrevPage: result.currentPage > 1,
      },
    };
  }

  async update(id: string, dto: UpdateLeadDTO): Promise<IApiResponse<ILead>> {
    const updated = await this.leadRepo.update(id, dto);
    if (!updated) {
      throw new Error('Lead not found');
    }

    return {
      success: true,
      data: this.toLeadResponse(updated),
      message: 'Lead updated successfully',
    };
  }

  async delete(id: string): Promise<IApiResponse<null>> {
    const deleted = await this.leadRepo.delete(id);
    if (!deleted) {
      throw new Error('Lead not found');
    }

    return {
      success: true,
      message: 'Lead deleted successfully',
    };
  }

  async getStats(): Promise<IApiResponse<IStatsResponse>> {
    const stats = await this.leadRepo.getStats();
    return {
      success: true,
      data: stats,
    };
  }

  async getExportData(filters: Omit<LeadFiltersDTO, 'page' | 'limit'>): Promise<any[]> {
    const leads = await this.leadRepo.findAllForExport(filters);
    return leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone || '',
      Company: lead.company,
      Status: lead.status,
      Source: lead.source,
      Value: lead.value,
      Notes: lead.notes || '',
      'Created At': lead.createdAt?.toISOString() || '',
    }));
  }

  private toLeadResponse(lead: any): ILead {
    return {
      _id: lead.id || lead._id?.toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company,
      status: lead.status,
      source: lead.source,
      value: lead.value,
      notes: lead.notes || '',
      assignedTo: lead.assignedTo || '',
      createdBy: lead.createdBy,
      createdAt: lead.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: lead.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
