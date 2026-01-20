import { create } from 'zustand';
import { Blueprint, Field } from './types';

interface BlueprintState {
  blueprints: Blueprint[];
  addBlueprint: (name: string, description: string, fields: Field[]) => Blueprint;
  getBlueprints: () => Blueprint[];
  getBlueprint: (id: string) => Blueprint | undefined;
  deleteBlueprint: (id: string) => void;
}

export const useBlueprintStore = create<BlueprintState>((set, get) => ({
  blueprints: [],

  addBlueprint: (name: string, description: string, fields: Field[]) => {
    const newBlueprint: Blueprint = {
      id: `blueprint-${crypto.randomUUID()}`,
      name,
      description,
      fields: fields.sort((a, b) => a.position - b.position),
      createdAt: new Date(),
    };

    set((state) => ({
      blueprints: [...state.blueprints, newBlueprint],
    }));

    return newBlueprint;
  },

  getBlueprints: () => {
    return get().blueprints;
  },

  getBlueprint: (id: string) => {
    return get().blueprints.find((bp) => bp.id === id);
  },

  deleteBlueprint: (id: string) => {
    set((state) => ({
      blueprints: state.blueprints.filter((bp) => bp.id !== id),
    }));
  },
}));
