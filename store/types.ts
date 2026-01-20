// Field Types
export type FieldType = 'text' | 'date' | 'signature' | 'checkbox';

// Contract Status Types
export type ContractStatus = 
  | 'created' 
  | 'approved' 
  | 'sent' 
  | 'signed' 
  | 'locked' 
  | 'revoked';

// Field Definition
export interface Field {
  id: string;
  type: FieldType;
  label: string;
  position: number;
  required?: boolean;
}

// Blueprint
export interface Blueprint {
  id: string;
  name: string;
  description?: string;
  fields: Field[];
  createdAt: Date;
}

// Contract
export interface Contract {
  id: string;
  name: string;
  blueprintId: string;
  status: ContractStatus;
  fieldValues: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// State Machine Transitions
export const STATUS_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  created: ['approved', 'revoked'],
  approved: ['sent'],
  sent: ['signed', 'revoked'],
  signed: ['locked'],
  locked: [],
  revoked: [],
};

// Helper function to check if transition is valid
export const isValidTransition = (
  currentStatus: ContractStatus,
  nextStatus: ContractStatus
): boolean => {
  return STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};

// Helper function to check if status allows editing
export const canEditContract = (status: ContractStatus): boolean => {
  return status !== 'locked' && status !== 'revoked';
};

// Status display configuration
export const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string }> = {
  created: { label: 'Created', color: 'gray' },
  approved: { label: 'Approved', color: 'blue' },
  sent: { label: 'Sent', color: 'yellow' },
  signed: { label: 'Signed', color: 'green' },
  locked: { label: 'Locked', color: 'purple' },
  revoked: { label: 'Revoked', color: 'red' },
};
