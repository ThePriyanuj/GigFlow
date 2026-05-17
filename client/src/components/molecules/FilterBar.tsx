import React, { useState } from 'react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sourceFilter: string;
  onSourceChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}


const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const sortOptions = [
  { value: 'desc', label: 'Latest' },
  { value: 'asc', label: 'Oldest' },
];


const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasFilters = statusFilter || sourceFilter || searchValue;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search leads by name, email, company..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <div className="w-36">
          <Select
            options={sortOptions}
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
          />
        </div>

        <Button
          variant={isExpanded ? 'primary' : 'secondary'}
          size="md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>

        {hasFilters && (
          <Button variant="ghost" size="md" onClick={onClearFilters}>
            <X size={16} />
            Clear
          </Button>
        )}
      </div>


      {isExpanded && (
        <div className="flex gap-3 flex-wrap animate-in slide-in-from-top-2 duration-200">
          <div className="w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              options={sourceOptions}
              value={sourceFilter}
              onChange={(e) => onSourceChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
