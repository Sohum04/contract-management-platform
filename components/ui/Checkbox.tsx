import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={checkboxId}
        className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};
