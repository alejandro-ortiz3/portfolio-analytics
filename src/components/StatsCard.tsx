import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  valueColor?: string;
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  valueColor = 'text-gray-900 dark:text-white',
  iconColor = 'text-blue-500'
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
    </div>
  );
};