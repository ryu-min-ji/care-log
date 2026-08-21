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

export function mockGenerate(
  childName: string,
  memo: string,
  tone: ToneId = "warm",
): GenerateResult {
  const domains = detectDomains(memo);
  const cleaned = memo.trim().replace(/\s+/g, " ");

  const observation =
    tone === "concise"
      ? `${childName}: "${cleaned}" 활동 관찰. 또래와의 상호작용에서 적극성과 몰입도가 높았음. ` +
        `다음 활동에서 관련 경험을 확장할 자료를 제공할 예정.`
      : tone === "formal"
        ? `${childName} 원아는 금일 활동 중 "${cleaned}"와(과) 관련된 행동을 보였습니다. ` +
          `또래와의 상호작용 과정에서 적극적으로 참여하는 태도가 관찰되었으며, 해당 활동에 대한 흥미와 몰입도가 높은 것으로 판단됩니다. ` +
          `향후 지도 계획으로는 이번 경험을 확장할 수 있도록 관련 자료와 충분한 시간을 제공할 예정입니다.`
        : `${childName}은(는) 오늘 활동 중 "${cleaned}"와(과) 관련된 모습을 보였다. ` +
          `또래와의 상호작용 속에서 적극적으로 참여하는 태도가 관찰되었으며, 활동에 대한 흥미와 몰입도가 높았다. ` +
          `다음 활동에서는 이번 경험을 확장할 수 있도록 관련 자료와 시간을 충분히 제공할 예정이다.`;

  const parentMessage =
    tone === "concise"
      ? `오늘 ${childName}이(가) "${cleaned}" 활동을 즐겁게 했어요. 친구들과도 잘 어울렸습니다.`
      : tone === "formal"
        ? `오늘 ${childName} 어린이는 "${cleaned}" 활동에 참여하며 즐거운 시간을 보냈습니다. ` +
          `또래와 원만하게 어울리는 모습이 인상적이었으며, 가정에서도 관련 대화를 나눠보시길 권해드립니다.`
        : `오늘 ${childName}이(가) "${cleaned}" 활동을 하며 즐겁게 보냈어요. ` +
          `친구들과 함께 어울리는 모습이 참 보기 좋았답니다. 집에서도 오늘 이야기를 나눠보시면 좋을 것 같아요!`;

  return { domains, observation, parentMessage };
}
