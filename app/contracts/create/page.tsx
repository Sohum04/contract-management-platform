'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBlueprintStore } from '@/store/blueprintStore';
import { useContractStore } from '@/store/contractStore';
import { Blueprint } from '@/store/types';
import { ContractForm } from '@/components/contract/ContractForm';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function CreateContractContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedBlueprintId = searchParams.get('blueprintId');

  const blueprints = useBlueprintStore((state) => state.getBlueprints());
  const getBlueprint = useBlueprintStore((state) => state.getBlueprint);
  const createContract = useContractStore((state) => state.createContract);

  const [contractName, setContractName] = useState('');
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(preSelectedBlueprintId || '');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<{ name?: string; blueprint?: string }>({});

  useEffect(() => {
    if (selectedBlueprintId) {
      const blueprint = getBlueprint(selectedBlueprintId);
      setSelectedBlueprint(blueprint || null);
    } else {
      setSelectedBlueprint(null);
    }
  }, [selectedBlueprintId, getBlueprint]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const validateForm = () => {
    const newErrors: { name?: string; blueprint?: string } = {};

    if (!contractName.trim()) {
      newErrors.name = 'Contract name is required';
    }

    if (!selectedBlueprintId) {
      newErrors.blueprint = 'Please select a blueprint';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const contract = createContract(contractName, selectedBlueprintId);
    router.push(`/contracts/${contract.id}`);
  };

  const blueprintOptions = [
    { value: '', label: 'Select a blueprint...' },
    ...blueprints.map((bp) => ({ value: bp.id, label: bp.name })),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Contract</h1>
        <p className="mt-2 text-gray-600">Select a blueprint and fill in the contract details</p>
      </div>

      {blueprints.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-2">No Blueprints Available</h3>
          <p className="text-yellow-700 mb-4">
            You need to create a blueprint first before creating a contract.
          </p>
          <Button onClick={() => router.push('/blueprints/create')}>
            Create Blueprint
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
            <Input
              label="Contract Name"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              error={errors.name}
              placeholder="e.g., John Doe Employment Agreement"
              required
            />

            <Select
              label="Select Blueprint"
              value={selectedBlueprintId}
              onChange={(e) => setSelectedBlueprintId(e.target.value)}
              options={blueprintOptions}
              error={errors.blueprint}
              required
            />

            {selectedBlueprint && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contract Fields</h3>
                <ContractForm
                  blueprint={selectedBlueprint}
                  fieldValues={fieldValues}
                  onFieldChange={handleFieldChange}
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Contract</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CreateContractPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateContractContent />
    </Suspense>
  );
}
