'use client';

import Link from 'next/link';
import { useContractStore } from '@/store/contractStore';
import { useBlueprintStore } from '@/store/blueprintStore';
import { ContractTable } from '@/components/contract/ContractTable';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const contracts = useContractStore((state) => state.getContracts());
  const blueprints = useBlueprintStore((state) => state.getBlueprints());

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === 'created' || c.status === 'approved').length,
    pending: contracts.filter((c) => c.status === 'sent').length,
    signed: contracts.filter((c) => c.status === 'signed' || c.status === 'locked').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contract Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage and track all your contracts</p>
          </div>
          <Link href="/contracts/create">
            <Button>Create New Contract</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <div className="text-sm font-medium text-gray-600">Total Contracts</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <div className="text-sm font-medium text-gray-600">Active</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.active}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <div className="text-sm font-medium text-gray-600">Pending</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <div className="text-sm font-medium text-gray-600">Signed</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.signed}</div>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-gray-200 rounded-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Contracts</h2>
        <ContractTable contracts={contracts} blueprints={blueprints} />
      </div>
    </div>
  );
}
