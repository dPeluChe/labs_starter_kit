export interface ModelField {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
  };
}

export interface AvailableModel {
  name: string;
  description: string;
  exists: boolean;
}

export interface ResultType {
  success: boolean;
  message?: string;
  error?: string;
}