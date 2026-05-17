import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { leadService } from '../services/leadService';
import Navbar from '../components/organisms/Navbar';
import LeadTable from '../components/organisms/LeadTable';
import LeadForm from '../components/organisms/LeadForm';
import StatCard from '../components/molecules/StatCard';
import FilterBar from '../components/molecules/FilterBar';
import Pagination from '../components/molecules/Pagination';
import Button from '../components/atoms/Button';
import { Plus, Download, Users, DollarSign, TrendingUp, Target } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);


  // Debounced search (500ms)
  const debouncedSearch = useDebounce(search, 500);

  // Fetch leads with React Query
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', debouncedSearch, statusFilter, sourceFilter, currentPage, sortOrder],
    queryFn: () =>
      leadService.getAll({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: sortOrder,
      }),
  });


  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => leadService.getStats(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => leadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setShowForm(false);
      toast.success('Lead created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create lead');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => leadService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setEditingLead(null);
      toast.success('Lead updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update lead');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete lead');
    },
  });

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setSourceFilter('');
    setSortOrder('desc');
    setCurrentPage(1);
  }, []);


  const handleExportCsv = async () => {
    try {
      await leadService.exportCsv({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
      });
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  const stats = statsData?.data;
  const leads = leadsData?.data || [];
  const pagination = leadsData?.pagination;

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads || 0}
            icon={<Users size={22} />}
            color="primary"
          />
          <StatCard
            title="Total Pipeline"
            value={`$${(stats?.totalValue || 0).toLocaleString()}`}
            icon={<DollarSign size={22} />}
            color="green"
          />
          <StatCard
            title="Conversion Rate"
            value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
            icon={<TrendingUp size={22} />}
            color="amber"
          />
          <StatCard
            title="Won Deals"
            value={stats?.byStatus?.Won || 0}
            icon={<Target size={22} />}
            color="rose"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-bold text-white">Lead Management</h2>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="secondary" onClick={handleExportCsv}>
                <Download size={16} />
                Export CSV
              </Button>
            )}
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} />
              New Lead
            </Button>
          </div>
        </div>


        {/* Filters */}
        <FilterBar
          searchValue={search}
          onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          sourceFilter={sourceFilter}
          onSourceChange={(val) => { setSourceFilter(val); setCurrentPage(1); }}
          sortOrder={sortOrder}
          onSortOrderChange={(val) => { setSortOrder(val); setCurrentPage(1); }}
          onClearFilters={handleClearFilters}
        />


        {/* Lead Table */}
        <LeadTable
          leads={leads}
          onEdit={(lead) => setEditingLead(lead)}
          onDelete={handleDelete}
          isAdmin={isAdmin}
          isLoading={leadsLoading}
        />

        {/* Pagination */}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            limit={pagination.limit}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* Create Form Modal */}
      {showForm && (
        <LeadForm
          onSubmit={(data) => createMutation.mutate(data)}
          onClose={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Edit Form Modal */}
      {editingLead && (
        <LeadForm
          initialData={editingLead}
          onSubmit={(data) => updateMutation.mutate({ id: editingLead._id, data })}
          onClose={() => setEditingLead(null)}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default DashboardPage;
