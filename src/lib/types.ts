import type { DomainId } from "./domains";

export interface Child {
  id: string;
  name: string;
  className: string;
  createdAt: number;
}

export interface Entry {
  id: string;
  childId: string;
  date: string;
  memo: string;
  domains: DomainId[];
  observation: string;
  parentMessage: string;
  imageDataUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface GenerateResult {
  domains: DomainId[];
  observation: string;
  parentMessage: string;
}

export interface DraftEntry {
  date: string;
  memo: string;
  domains: DomainId[];
  observation: string;
  parentMessage: string;
  imageDataUrl?: string;
}
