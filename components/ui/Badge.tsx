import React from 'react';
import { ContractStatus, STATUS_CONFIG } from '@/store/types';

interface BadgeProps {
  status: ContractStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status];
  
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    red: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        colorClasses[config.color]
      } ${className}`}
    >
      {config.label}
    </span>
  );
};
