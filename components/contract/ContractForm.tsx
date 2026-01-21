'use client';

import React from 'react';
import { Blueprint } from '@/store/types';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

interface ContractFormProps {
  blueprint: Blueprint;
  fieldValues: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  disabled?: boolean;
}

export const ContractForm: React.FC<ContractFormProps> = ({
  blueprint,
  fieldValues,
  onFieldChange,
  disabled = false,
}) => {
  const renderField = (field: any) => {
    const value = fieldValues[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            label={field.label}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={disabled}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            label={field.label}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={disabled}
          />
        );
      case 'signature':
        return (
          <Input
            label={field.label}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            required={field.required}
            disabled={disabled}
            placeholder="Type your signature"
            className="italic"
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            label={field.label}
            checked={value || false}
            onChange={(e) => onFieldChange(field.id, e.target.checked)}
            required={field.required}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-900">Blueprint: {blueprint.name}</h3>
        {blueprint.description && (
          <p className="text-sm text-blue-700 mt-1">{blueprint.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {blueprint.fields.map((field) => (
          <div key={field.id}>{renderField(field)}</div>
        ))}
      </div>

      {disabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            This contract is locked and cannot be edited.
          </p>
        </div>
      )}
    </div>
  );
};
