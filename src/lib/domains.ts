export type DomainId =
  | "physical"
  | "communication"
  | "social"
  | "art"
  | "nature";

export const DOMAINS: { id: DomainId; label: string }[] = [
  { id: "physical", label: "신체운동·건강" },
  { id: "communication", label: "의사소통" },
  { id: "social", label: "사회관계" },
  { id: "art", label: "예술경험" },
  { id: "nature", label: "자연탐구" },
];

export const DOMAIN_LABEL: Record<DomainId, string> = DOMAINS.reduce(
  (acc, d) => ({ ...acc, [d.id]: d.label }),
  {} as Record<DomainId, string>,
);

export function isDomainId(value: string): value is DomainId {
  return DOMAINS.some((d) => d.id === value);
}
