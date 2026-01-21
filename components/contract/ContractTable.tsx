'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Contract } from '@/store/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';

interface ContractTableProps {
  contracts: Contract[];
  blueprints: any[];
}

type FilterStatus = 'all' | 'active' | 'pending' | 'signed';

export const ContractTable: React.FC<ContractTableProps> = ({ contracts, blueprints }) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getBlueprintName = (blueprintId: string) => {
    const blueprint = blueprints.find((bp) => bp.id === blueprintId);
    return blueprint ? blueprint.name : 'Unknown';
  };

  const filteredContracts = useMemo(() => {
    let filtered = [...contracts];

    // Apply status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter((c) => c.status === 'created' || c.status === 'approved');
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter((c) => c.status === 'sent');
    } else if (filterStatus === 'signed') {
      filtered = filtered.filter((c) => c.status === 'signed' || c.status === 'locked');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [contracts, filterStatus, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'createdAt' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Contracts' },
    { value: 'active', label: 'Active (Created/Approved)' },
    { value: 'pending', label: 'Pending (Sent)' },
    { value: 'signed', label: 'Signed (Signed/Locked)' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          options={filterOptions}
          className="w-64"
        />
        <div className="text-sm text-gray-600">
          Showing {filteredContracts.length} of {contracts.length} contracts
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">No contracts found.</p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center hover:text-gray-900"
                >
                  Contract Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </TableHeader>
              <TableHeader>Blueprint</TableHeader>
              <TableHeader>
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center hover:text-gray-900"
                >
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </TableHeader>
              <TableHeader>
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center hover:text-gray-900"
                >
                  Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium text-gray-900">{contract.name}</TableCell>
                <TableCell className="text-gray-600">{getBlueprintName(contract.blueprintId)}</TableCell>
                <TableCell>
                  <Badge status={contract.status} />
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(contract.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={`/contracts/${contract.id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
