import React from 'react';
import { Field } from '@/store/types';

interface BlueprintPreviewProps {
  fields: Field[];
}

export const BlueprintPreview: React.FC<BlueprintPreviewProps> = ({ fields }) => {
  const renderFieldPreview = (field: Field) => {
    const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md bg-white';

    switch (field.type) {
      case 'text':
      case 'signature':
        return <input type="text" className={baseClasses} placeholder={field.label} disabled />;
      case 'date':
        return <input type="date" className={baseClasses} disabled />;
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" disabled />
            <label className="ml-2 text-sm text-gray-700">{field.label}</label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Blueprint Preview</h3>
      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">No fields to preview</p>
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-200 rounded-md space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              {field.type !== 'checkbox' && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-600 ml-1">*</span>}
                </label>
              )}
              {renderFieldPreview(field)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
