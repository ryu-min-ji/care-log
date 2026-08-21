import type { DomainId } from "./domains";
import type { GenerateResult } from "./types";
import type { ToneId } from "./tone";

const KEYWORD_DOMAINS: { domain: DomainId; keywords: string[] }[] = [
  { domain: "physical", keywords: ["달리기", "뛰", "산책", "체육", "공", "균형", "몸", "운동"] },
  { domain: "communication", keywords: ["책", "이야기", "말", "발표", "노래 가사", "질문", "대화"] },
  { domain: "social", keywords: ["친구", "협동", "함께", "양보", "다툼", "차례", "역할놀이"] },
  { domain: "art", keywords: ["그림", "색칠", "노래", "춤", "만들기", "꾸미기", "악기"] },
  { domain: "nature", keywords: ["관찰", "곤충", "식물", "물", "자연", "날씨", "실험"] },
];

function detectDomains(memo: string): DomainId[] {
  const found = KEYWORD_DOMAINS.filter((entry) =>
    entry.keywords.some((kw) => memo.includes(kw)),
  ).map((entry) => entry.domain);
  return found.length > 0 ? found.slice(0, 2) : ["social"];
}

function extractKeywords(memo: string): string[] {
  const parts = memo
    .split(/[,、·\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.length > 0 ? parts : [memo.trim()];
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

interface Bank {
  opening: string[];
  interpretation: string[];
  nextStep: string[];
}

const OBSERVATION_BANK: Record<DomainId, Bank> = {
  physical: {
    opening: [
      '${n}은(는) "${k}" 활동에서 몸을 크게 움직이며 적극적으로 참여했다.',
      '${n}은(는) 오늘 "${k}" 활동에 참여하며 신체를 활발하게 사용하는 모습을 보였다.',
    ],
    interpretation: [
      "균형을 잡고 힘을 조절하는 동작이 이전보다 안정적으로 나타났으며, 신체 활동에 대한 자신감도 함께 드러났다.",
      "몸을 움직이는 데 주저함이 없었고, 또래와 속도를 맞추며 협응하는 모습도 관찰되었다.",
    ],
    nextStep: [
      "다음에는 대근육을 더 다양하게 사용할 수 있는 활동을 계획해볼 예정이다.",
      "신체 조절 능력을 확장할 수 있도록 관련 활동 시간을 충분히 제공할 예정이다.",
    ],
  },
  communication: {
    opening: [
      '${n}은(는) "${k}" 상황에서 자신의 생각을 말로 적극적으로 표현했다.',
      '${n}은(는) 오늘 "${k}" 활동을 하며 또래와 언어로 소통하려는 모습을 보였다.',
    ],
    interpretation: [
      "상황에 맞는 어휘를 사용해 의사를 전달했으며, 상대의 말에 귀 기울이는 태도도 함께 나타났다.",
      "짧은 문장으로나마 자신의 의사를 분명히 표현했고, 대화를 이어가려는 시도가 관찰되었다.",
    ],
    nextStep: [
      "다음에는 좀 더 풍부한 어휘를 접할 수 있는 이야기 활동을 준비할 예정이다.",
      "또래와의 대화가 확장될 수 있도록 관련 상황을 자주 마련할 예정이다.",
    ],
  },
  social: {
    opening: [
      '${n}은(는) "${k}" 상황에서 또래와 함께 어울리는 모습을 보였다.',
      '${n}은(는) 오늘 "${k}" 활동을 하며 친구들과 자연스럽게 상호작용했다.',
    ],
    interpretation: [
      "차례를 지키고 역할을 나누는 과정에서 협동하는 태도가 나타났으며, 완성 후 성취감을 또래와 함께 나누었다.",
      "또래의 의견을 존중하며 함께 활동을 이어가는 모습이 인상적이었고, 갈등 상황에서도 스스로 조율하려는 태도를 보였다.",
    ],
    nextStep: [
      "다음에는 더 다양한 구성원과 협동할 수 있는 소집단 활동을 계획해볼 예정이다.",
      "또래 관계가 확장될 수 있도록 관련 놀이 시간을 충분히 제공할 예정이다.",
    ],
  },
  art: {
    opening: [
      '${n}은(는) "${k}" 활동에 몰입하며 자신만의 표현을 시도했다.',
      '${n}은(는) 오늘 "${k}" 활동을 통해 창의적인 표현 욕구를 드러냈다.',
    ],
    interpretation: [
      "색과 형태를 자유롭게 조합하며 결과물에 애정을 보였고, 완성 후에는 스스로 만족하는 모습을 나타냈다.",
      "손끝의 소근육을 세밀하게 사용하며 집중력 있게 활동을 이어갔고, 자신의 작품을 또래에게 설명하려는 모습도 보였다.",
    ],
    nextStep: [
      "다음에는 다른 재료를 활용한 표현 활동으로 경험을 확장해볼 예정이다.",
      "창의적 표현이 이어질 수 있도록 다양한 미술 도구를 준비할 예정이다.",
    ],
  },
  nature: {
    opening: [
      '${n}은(는) "${k}" 상황에서 주변을 세심하게 관찰하는 모습을 보였다.',
      '${n}은(는) 오늘 "${k}" 활동을 통해 자연물에 대한 호기심을 드러냈다.',
    ],
    interpretation: [
      "궁금한 점을 질문으로 표현하며 탐구하는 태도를 보였고, 변화하는 모습을 꾸준히 지켜보려는 집중력도 나타났다.",
      "직접 만지고 살펴보며 특징을 발견하려는 시도가 관찰되었고, 새로운 발견에 즐거워하는 모습을 보였다.",
    ],
    nextStep: [
      "다음에는 관련 자연물을 직접 탐색할 수 있는 기회를 더 마련할 예정이다.",
      "탐구심이 이어질 수 있도록 관찰 도구와 시간을 충분히 제공할 예정이다.",
    ],
  },
};

const PARENT_BANK: Record<DomainId, string[]> = {
  physical: [
    '오늘 ${n}이(가) "${k}" 활동을 하며 몸을 마음껏 움직였어요. 신나게 참여하는 모습이 참 보기 좋았답니다!',
    '${n}이(가) 오늘 "${k}" 활동에 적극적으로 참여했어요. 활기찬 모습을 집에서도 이야기 나눠보시면 좋을 것 같아요!',
  ],
  communication: [
    '오늘 ${n}이(가) "${k}" 시간에 자기 생각을 씩씩하게 말로 표현했어요. 집에서도 오늘 있었던 일을 물어봐주세요!',
    '${n}이(가) "${k}" 활동을 하며 친구들과 이야기 나누는 모습이 참 대견했어요.',
  ],
  social: [
    '오늘 ${n}이(가) "${k}" 활동을 하며 친구들과 즐겁게 어울렸어요. 함께하는 모습이 참 보기 좋았답니다!',
    '${n}이(가) "${k}" 시간에 친구와 사이좋게 지내는 모습을 보였어요. 집에서도 오늘 이야기를 나눠보시면 좋을 것 같아요!',
  ],
  art: [
    '오늘 ${n}이(가) "${k}" 활동에 푹 빠져 있었어요. 완성한 작품 이야기를 집에서도 들어봐주세요!',
    '${n}이(가) "${k}" 활동을 하며 자유롭게 표현하는 모습이 참 사랑스러웠어요.',
  ],
  nature: [
    '오늘 ${n}이(가) "${k}" 활동을 하며 눈을 반짝이며 관찰했어요. 궁금한 게 참 많은 하루였답니다!',
    '${n}이(가) "${k}" 시간에 호기심 가득한 모습을 보였어요. 집에서도 관련 이야기 나눠보시면 좋을 것 같아요!',
  ],
};

const TONE_ENDING: Record<ToneId, (s: string) => string> = {
  warm: (s) => s,
  concise: (s) =>
    s
      .replace(/했다\.$/g, "함.")
      .replace(/보였다\.$/g, "관찰됨.")
      .replace(/예정이다\.$/g, "예정.")
      .replace(/나타났다\.$/g, "나타남."),
  formal: (s) =>
    s
      .replace(/은\(는\)/g, "원아는")
      .replace(/했다\./g, "하였습니다.")
      .replace(/보였다\./g, "보였습니다.")
      .replace(/예정이다\./g, "예정입니다.")
      .replace(/나타났다\./g, "나타났습니다."),
};

function seedFrom(memo: string): number {
  let sum = 0;
  for (let i = 0; i < memo.length; i++) sum += memo.charCodeAt(i);
  return sum;
}

export function mockGenerate(
  childName: string,
  memo: string,
  tone: ToneId = "warm",
): GenerateResult {
  const domains = detectDomains(memo);
  const primaryDomain = domains[0];
  const keywords = extractKeywords(memo);
  const seed = seedFrom(memo);

  const bank = OBSERVATION_BANK[primaryDomain];
  const openingTpl = pick(bank.opening, seed);
  const opening = openingTpl
    .replace("${n}", childName)
    .replace("${k}", keywords[0] ?? memo.trim());
  const interpretation = pick(bank.interpretation, seed + 1);
  const nextStep = pick(bank.nextStep, seed + 2);

  const observationRaw = `${opening} ${interpretation} ${nextStep}`;
  const observation = TONE_ENDING[tone](observationRaw);

  const parentTpl = pick(PARENT_BANK[primaryDomain], seed + 3);
  const parentRaw = parentTpl
    .replace("${n}", childName)
    .replace("${k}", keywords[0] ?? memo.trim());
  const parentMessage =
    tone === "formal"
      ? parentRaw.replace(/이\(가\)/g, "어린이는").replace(/요[!.]?$/g, "습니다.")
      : tone === "concise"
        ? parentRaw.split(". ")[0] + "."
        : parentRaw;

  return { domains, observation, parentMessage };
}
