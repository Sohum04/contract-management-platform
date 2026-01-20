import { create } from 'zustand';
import { Contract, ContractStatus, isValidTransition } from './types';

interface ContractState {
  contracts: Contract[];
  createContract: (name: string, blueprintId: string) => Contract;
  getContracts: () => Contract[];
  getContract: (id: string) => Contract | undefined;
  updateFieldValues: (id: string, fieldValues: Record<string, any>) => void;
  updateStatus: (id: string, newStatus: ContractStatus) => boolean;
  deleteContract: (id: string) => void;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],

  createContract: (name: string, blueprintId: string) => {
    const newContract: Contract = {
      id: `contract-${crypto.randomUUID()}`,
      name,
      blueprintId,
      status: 'created',
      fieldValues: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      contracts: [...state.contracts, newContract],
    }));

    return newContract;
  },

  getContracts: () => {
    return get().contracts;
  },

  getContract: (id: string) => {
    return get().contracts.find((contract) => contract.id === id);
  },

  updateFieldValues: (id: string, fieldValues: Record<string, any>) => {
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === id
          ? { ...contract, fieldValues, updatedAt: new Date() }
          : contract
      ),
    }));
  },

  updateStatus: (id: string, newStatus: ContractStatus) => {
    const contract = get().contracts.find((c) => c.id === id);

    if (!contract) {
      return false;
    }

    // Validate state transition
    if (!isValidTransition(contract.status, newStatus)) {
      console.error(`Invalid transition from ${contract.status} to ${newStatus}`);
      return false;
    }

    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === id
          ? { ...c, status: newStatus, updatedAt: new Date() }
          : c
      ),
    }));

    return true;
  },

  deleteContract: (id: string) => {
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    }));
  },
}));
