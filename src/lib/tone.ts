export type ToneId = "warm" | "concise" | "formal";

export const TONES: { id: ToneId; label: string; description: string }[] = [
  { id: "warm", label: "다정한", description: "따뜻하고 다정한 어투" },
  { id: "concise", label: "간결한", description: "군더더기 없이 간결한 어투" },
  { id: "formal", label: "격식 있는", description: "격식을 갖춘 정중한 어투" },
];

export const TONE_LABEL: Record<ToneId, string> = TONES.reduce(
  (acc, t) => ({ ...acc, [t.id]: t.label }),
  {} as Record<ToneId, string>,
);

export const TONE_DESCRIPTION: Record<ToneId, string> = TONES.reduce(
  (acc, t) => ({ ...acc, [t.id]: t.description }),
  {} as Record<ToneId, string>,
);

export function isToneId(value: string): value is ToneId {
  return TONES.some((t) => t.id === value);
}
