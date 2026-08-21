import type { DomainId } from "./domains";

export interface Child {
  id: string;
  name: string;
  className: string;
  createdAt: number;
}

export type EntryStatus = "draft" | "saved";

export interface Entry {
  id: string;
  childId: string;
  memo: string;
  domains: DomainId[];
  observation: string;
  parentMessage: string;
  status: EntryStatus;
  createdAt: number;
  updatedAt: number;
}

export interface GenerateResult {
  domains: DomainId[];
  observation: string;
  parentMessage: string;
}
