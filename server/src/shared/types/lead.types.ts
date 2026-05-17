export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  REFERRAL = 'Referral',
  INSTAGRAM = 'Instagram',
}



export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  notes: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLeadRequest {
  name: string;
  email: string;
  phone?: string;
  company: string;
  status?: LeadStatus;
  source: LeadSource;
  value?: number;
  notes?: string;
}

export interface IUpdateLeadRequest extends Partial<ICreateLeadRequest> {}

export interface ILeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
