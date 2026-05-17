import { LeadEntity } from '../entities/Lead';
import { ILeadFilters } from '../../shared/types/lead.types';

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ILeadRepository {
  create(lead: LeadEntity): Promise<LeadEntity>;
  findById(id: string): Promise<LeadEntity | null>;
  findAll(filters: ILeadFilters): Promise<PaginatedResult<LeadEntity>>;
  update(id: string, lead: Partial<LeadEntity>): Promise<LeadEntity | null>;
  delete(id: string): Promise<boolean>;
  getStats(): Promise<{
    totalLeads: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    totalValue: number;
    conversionRate: number;
  }>;
  findAllForExport(filters: Omit<ILeadFilters, 'page' | 'limit'>): Promise<LeadEntity[]>;
}
