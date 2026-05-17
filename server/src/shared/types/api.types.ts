export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface IStatsResponse {
  totalLeads: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  totalValue: number;
  conversionRate: number;
}
