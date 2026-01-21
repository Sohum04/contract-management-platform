'use client';

import React from 'react';
import { ContractStatus, STATUS_TRANSITIONS, STATUS_CONFIG } from '@/store/types';
import { Button } from '@/components/ui/Button';

interface StatusActionsProps {
  currentStatus: ContractStatus;
  onStatusChange: (newStatus: ContractStatus) => void;
}

export const StatusActions: React.FC<StatusActionsProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const availableTransitions = STATUS_TRANSITIONS[currentStatus];

  if (availableTransitions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <p className="text-sm text-gray-600">
          No further status changes available. This contract is in a terminal state.
        </p>
      </div>
    );
  }

  const getButtonVariant = (status: ContractStatus): 'primary' | 'success' | 'danger' => {
    if (status === 'revoked') return 'danger';
    if (status === 'signed' || status === 'locked') return 'success';
    return 'primary';
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Available Actions:</h4>
      <div className="flex flex-wrap gap-2">
        {availableTransitions.map((status) => (
          <Button
            key={status}
            onClick={() => onStatusChange(status)}
            variant={getButtonVariant(status)}
            size="sm"
          >
            Move to {STATUS_CONFIG[status].label}
          </Button>
        ))}
      </div>
    </div>
  );
};
