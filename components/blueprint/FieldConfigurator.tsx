'use client';

import React from 'react';
import { Field, FieldType } from '@/store/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

interface FieldConfiguratorProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
}

export const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({
  fields,
  onFieldsChange,
}) => {
  const fieldTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'date', label: 'Date' },
    { value: 'signature', label: 'Signature' },
    { value: 'checkbox', label: 'Checkbox' },
  ];

  const addField = () => {
    const newField: Field = {
      id: `field-${crypto.randomUUID()}`,
      type: 'text',
      label: '',
      position: fields.length,
      required: false,
    };
    onFieldsChange([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    onFieldsChange(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields
      .filter((_, i) => i !== index)
      .map((field, i) => ({ ...field, position: i }));
    onFieldsChange(updatedFields);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[newIndex]] = [
      updatedFields[newIndex],
      updatedFields[index],
    ];

    // Update positions
    updatedFields.forEach((field, i) => {
      field.position = i;
    });

    onFieldsChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Fields Configuration</h3>
        <Button onClick={addField} size="sm">
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No fields added yet. Click "Add Field" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Field Label"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  placeholder="Enter field label"
                  required
                />
                <Select
                  label="Field Type"
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value as FieldType })}
                  options={fieldTypeOptions}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Checkbox
                  label="Required Field"
                  checked={field.required || false}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => moveField(index, 'up')}
                    disabled={index === 0}
                    size="sm"
                    variant="outline"
                  >
                    ↑
                  </Button>
                  <Button
                    onClick={() => moveField(index, 'down')}
                    disabled={index === fields.length - 1}
                    size="sm"
                    variant="outline"
                  >
                    ↓
                  </Button>
                  <Button onClick={() => removeField(index)} size="sm" variant="danger">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
