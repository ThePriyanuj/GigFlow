// Domain Layer - Lead Entity
import { LeadStatus, LeadSource } from '../../shared/types/lead.types';

export interface LeadEntity {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  notes?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Lead {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly company: string,
    public readonly status: LeadStatus,
    public readonly source: LeadSource,
    public readonly value: number,
    public readonly createdBy: string,
    public readonly phone?: string,
    public readonly notes?: string,
    public readonly assignedTo?: string,
    public readonly id?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: LeadEntity): Lead {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Lead name must be at least 2 characters');
    }
    if (!props.email || !props.email.includes('@')) {
      throw new Error('Invalid lead email address');
    }
    if (!props.company || props.company.trim().length < 1) {
      throw new Error('Company name is required');
    }
    if (props.value < 0) {
      throw new Error('Lead value cannot be negative');
    }
    return new Lead(
      props.name.trim(),
      props.email.toLowerCase().trim(),
      props.company.trim(),
      props.status || LeadStatus.NEW,
      props.source,
      props.value || 0,
      props.createdBy,
      props.phone,
      props.notes,
      props.assignedTo,
      props.id,
      props.createdAt,
      props.updatedAt,
    );
  }
}
