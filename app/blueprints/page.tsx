'use client';

import Link from 'next/link';
import { useBlueprintStore } from '@/store/blueprintStore';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';

export default function BlueprintsPage() {
  const blueprints = useBlueprintStore((state) => state.getBlueprints());
  const deleteBlueprint = useBlueprintStore((state) => state.deleteBlueprint);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blueprint?')) {
      deleteBlueprint(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blueprints</h1>
            <p className="mt-2 text-gray-600">Create and manage contract templates</p>
          </div>
          <Link href="/blueprints/create">
            <Button>Create New Blueprint</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-6">
        {blueprints.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first contract blueprint
            </p>
            <Link href="/blueprints/create">
              <Button>Create Blueprint</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Fields</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {blueprints.map((blueprint) => (
                <TableRow key={blueprint.id}>
                  <TableCell className="font-medium text-gray-900">{blueprint.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {blueprint.description || 'No description'}
                  </TableCell>
                  <TableCell className="text-gray-600">{blueprint.fields.length} fields</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(blueprint.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/contracts/create?blueprintId=${blueprint.id}`}>
                        <Button size="sm" variant="primary">
                          Use Template
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(blueprint.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
