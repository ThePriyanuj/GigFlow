import React from 'react';
import Card from '../atoms/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, color = 'primary' }) => {
  const colorMap: Record<string, string> = {
    primary: 'from-primary-600 to-primary-400',
    green: 'from-emerald-600 to-emerald-400',
    amber: 'from-amber-600 to-amber-400',
    rose: 'from-rose-600 to-rose-400',
  };

  return (
    <Card hover className="relative overflow-hidden group">
      {/* Gradient accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[color] || colorMap.primary} opacity-5 rounded-full -translate-y-6 translate-x-6 group-hover:opacity-10 transition-opacity duration-500`} />

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-surface-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.primary} bg-opacity-10 text-white/80`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
