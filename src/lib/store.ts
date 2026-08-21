import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Child, Entry, GenerateResult } from "./types";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface CareLogState {
  children: Child[];
  entries: Entry[];
  addChild: (name: string, className: string) => Child;
  addDraftEntry: (childId: string, memo: string, result: GenerateResult) => Entry;
  updateEntry: (id: string, patch: Partial<Pick<Entry, "observation" | "parentMessage">>) => void;
  saveEntry: (id: string) => void;
  entriesForChild: (childId: string) => Entry[];
}

export const useCareLogStore = create<CareLogState>()(
  persist(
    (set, get) => ({
      children: [],
      entries: [],
      addChild: (name, className) => {
        const child: Child = {
          id: makeId(),
          name: name.trim(),
          className: className.trim(),
          createdAt: Date.now(),
        };
        set((state) => ({ children: [...state.children, child] }));
        return child;
      },
      addDraftEntry: (childId, memo, result) => {
        const now = Date.now();
        const entry: Entry = {
          id: makeId(),
          childId,
          memo,
          domains: result.domains,
          observation: result.observation,
          parentMessage: result.parentMessage,
          status: "draft",
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
        return entry;
      },
      updateEntry: (id, patch) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e,
          ),
        }));
      },
      saveEntry: (id) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, status: "saved", updatedAt: Date.now() } : e,
          ),
        }));
      },
      entriesForChild: (childId) => get().entries.filter((e) => e.childId === childId),
    }),
    { name: "care-log-storage" },
  ),
);
