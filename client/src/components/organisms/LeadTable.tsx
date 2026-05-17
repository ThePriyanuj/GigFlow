import React from 'react';
import Badge, { getStatusBadgeVariant, getSourceBadgeVariant } from '../atoms/Badge';
import Button from '../atoms/Button';
import { Pencil, Trash2 } from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  value: number;
  createdAt: string;
}

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  isLoading?: boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, isAdmin, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-surface-900/60 backdrop-blur-sm border border-surface-800 rounded-2xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-flex items-center gap-3 text-surface-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading leads...
          </div>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-surface-900/60 backdrop-blur-sm border border-surface-800 rounded-2xl overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-surface-400 text-lg">No leads found</p>
          <p className="text-surface-500 text-sm mt-1">Try adjusting your filters or create a new lead</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-900/60 backdrop-blur-sm border border-surface-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Lead</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Company</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Source</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Value</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Date</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/50">
            {leads.map((lead, index) => (
              <tr
                key={lead._id}
                className="hover:bg-surface-800/30 transition-colors duration-150 group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <p className="text-xs text-surface-400">{lead.email}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-surface-300">{lead.company}</p>
                </td>
                <td className="py-4 px-6">
                  <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge variant={getSourceBadgeVariant(lead.source)}>{lead.source}</Badge>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="text-sm font-semibold text-emerald-400">
                    ${lead.value.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs text-surface-400">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(lead)} title="Edit">
                      <Pencil size={14} />
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(lead._id)} title="Delete">
                        <Trash2 size={14} className="text-red-400" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
