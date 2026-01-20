'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlueprintStore } from '@/store/blueprintStore';
import { Field } from '@/store/types';
import { FieldConfigurator } from '@/components/blueprint/FieldConfigurator';
import { BlueprintPreview } from '@/components/blueprint/BlueprintPreview';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function CreateBlueprintPage() {
  const router = useRouter();
  const addBlueprint = useBlueprintStore((state) => state.addBlueprint);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [errors, setErrors] = useState<{ name?: string; fields?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; fields?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Blueprint name is required';
    }

    if (fields.length === 0) {
      newErrors.fields = 'At least one field is required';
    }

    const hasInvalidFields = fields.some((field) => !field.label.trim());
    if (hasInvalidFields) {
      newErrors.fields = 'All fields must have a label';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    addBlueprint(name, description, fields);
    router.push('/blueprints');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Blueprint</h1>
        <p className="mt-2 text-gray-600">Define a contract template with custom fields</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Blueprint Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  placeholder="e.g., Employment Contract"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of this blueprint"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-6">
              <FieldConfigurator fields={fields} onFieldsChange={setFields} />
              {errors.fields && <p className="mt-2 text-sm text-red-600">{errors.fields}</p>}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-md p-6 sticky top-4">
              <BlueprintPreview fields={fields} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Blueprint</Button>
        </div>
      </form>
    </div>
  );
}
