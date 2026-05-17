import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-surface-800 text-surface-300 border-surface-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    purple: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

// Helper to map lead status to badge variant
export const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  const map: Record<string, BadgeProps['variant']> = {
    'New': 'info',
    'Contacted': 'warning',
    'Qualified': 'purple',
    'Lost': 'danger',
  };
  return map[status] || 'default';
};

export const getSourceBadgeVariant = (source: string): BadgeProps['variant'] => {
  const map: Record<string, BadgeProps['variant']> = {
    'Website': 'info',
    'Referral': 'success',
    'Instagram': 'danger',
  };
  return map[source] || 'default';
};

