import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Child, DraftEntry, Entry } from "./types";
import type { ToneId } from "./tone";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface CareLogState {
  children: Child[];
  entries: Entry[];
  tone: ToneId;
  setTone: (tone: ToneId) => void;
  addChild: (name: string, className: string) => Child;
  addEntry: (childId: string, draft: DraftEntry) => Entry;
  updateEntry: (id: string, patch: Partial<Pick<Entry, "observation" | "parentMessage">>) => void;
  entriesForChild: (childId: string) => Entry[];
}

export const useCareLogStore = create<CareLogState>()(
  persist(
    (set, get) => ({
      children: [],
      entries: [],
      tone: "warm",
      setTone: (tone) => set({ tone }),
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
      addEntry: (childId, draft) => {
        const now = Date.now();
        const entry: Entry = {
          id: makeId(),
          childId,
          date: draft.date,
          memo: draft.memo,
          domains: draft.domains,
          observation: draft.observation,
          parentMessage: draft.parentMessage,
          imageDataUrl: draft.imageDataUrl,
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
      entriesForChild: (childId) => get().entries.filter((e) => e.childId === childId),
    }),
    { name: "care-log-storage" },
  ),
);
