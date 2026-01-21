'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useContractStore } from '@/store/contractStore';
import { useBlueprintStore } from '@/store/blueprintStore';
import { Contract, ContractStatus, canEditContract } from '@/store/types';
import { ContractForm } from '@/components/contract/ContractForm';
import { StatusActions } from '@/components/contract/StatusActions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;

  const getContract = useContractStore((state) => state.getContract);
  const updateFieldValues = useContractStore((state) => state.updateFieldValues);
  const updateStatus = useContractStore((state) => state.updateStatus);
  const deleteContract = useContractStore((state) => state.deleteContract);
  const getBlueprint = useBlueprintStore((state) => state.getBlueprint);

  const [contract, setContract] = useState<Contract | null>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const foundContract = getContract(contractId);
    if (foundContract) {
      setContract(foundContract);
      setFieldValues(foundContract.fieldValues);
      const foundBlueprint = getBlueprint(foundContract.blueprintId);
      setBlueprint(foundBlueprint);
    }
  }, [contractId, getContract, getBlueprint]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    updateFieldValues(contractId, fieldValues);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: ContractStatus) => {
    const success = updateStatus(contractId, newStatus);
    if (success) {
      const updatedContract = getContract(contractId);
      if (updatedContract) {
        setContract(updatedContract);
      }
    } else {
      alert('Invalid status transition');
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contract?')) {
      deleteContract(contractId);
      router.push('/');
    }
  };

  if (!contract || !blueprint) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contract Not Found</h2>
          <p className="text-gray-600 mb-6">The contract you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const canEdit = canEditContract(contract.status);
  const isLocked = contract.status === 'locked';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contract.name}</h1>
            <p className="mt-2 text-gray-600">
              Created on {new Date(contract.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge status={contract.status} />
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contract Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Current Status:</span>
            <Badge status={contract.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Last Updated:</span>
            <span className="text-gray-600">
              {new Date(contract.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {canEdit && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <StatusActions currentStatus={contract.status} onStatusChange={handleStatusChange} />
          </div>
        )}
      </div>

      {/* Contract Fields */}
      <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Contract Details</h2>
          {canEdit && !isEditing && (
            <Button onClick={() => setIsEditing(true)} size="sm">
              Edit Fields
            </Button>
          )}
        </div>

        <ContractForm
          blueprint={blueprint}
          fieldValues={fieldValues}
          onFieldChange={handleFieldChange}
          disabled={isLocked || !isEditing}
        />

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setFieldValues(contract.fieldValues);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="danger" onClick={handleDelete}>
          Delete Contract
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
