import type { DomainId } from "./domains";
import type { GenerateResult } from "./types";

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

export function mockGenerate(childName: string, memo: string): GenerateResult {
  const domains = detectDomains(memo);
  const cleaned = memo.trim().replace(/\s+/g, " ");

  const observation =
    `${childName}은(는) 오늘 활동 중 "${cleaned}"와(과) 관련된 모습을 보였다. ` +
    `또래와의 상호작용 속에서 적극적으로 참여하는 태도가 관찰되었으며, 활동에 대한 흥미와 몰입도가 높았다. ` +
    `다음 활동에서는 이번 경험을 확장할 수 있도록 관련 자료와 시간을 충분히 제공할 예정이다.`;

  const parentMessage =
    `오늘 ${childName}이(가) "${cleaned}" 활동을 하며 즐겁게 보냈어요. ` +
    `친구들과 함께 어울리는 모습이 참 보기 좋았답니다. 집에서도 오늘 이야기를 나눠보시면 좋을 것 같아요!`;

  return { domains, observation, parentMessage };
}
