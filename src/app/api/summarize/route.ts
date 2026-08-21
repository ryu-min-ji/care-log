import { NextResponse } from "next/server";
import { DOMAIN_LABEL, type DomainId } from "@/lib/domains";

const MODEL = "llama-3.3-70b-versatile";

interface EntryInput {
  memo: string;
  domains: DomainId[];
}

function buildSystemPrompt(): string {
  return `당신은 보육교사를 위한 학기 관찰 리포트 작성 보조 도구입니다.
주어진 한 원아의 이번 학기 관찰 메모 목록을 바탕으로, 성장과 변화, 두드러진 특징, 다음 학기 지도 시 참고할 점을
담은 3~5문장의 존댓말 요약을 작성하세요. 반드시 순수 텍스트로만 응답하고 다른 설명은 붙이지 마세요.`;
}

async function callGroq(childName: string, entries: EntryInput[]): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const memoList = entries
      .map((e, i) => `${i + 1}. [${e.domains.map((d) => DOMAIN_LABEL[d]).join(", ")}] ${e.memo}`)
      .join("\n");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          {
            role: "user",
            content: `원아 이름: ${childName}\n이번 학기 관찰 메모 목록:\n${memoList}`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content: string | undefined = data.choices?.[0]?.message?.content;
    return content?.trim() || null;
  } catch {
    return null;
  }
}

function mockSummarize(childName: string, entries: EntryInput[]): string {
  const counts = new Map<DomainId, number>();
  for (const e of entries) {
    for (const d of e.domains) {
      counts.set(d, (counts.get(d) ?? 0) + 1);
    }
  }
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];

  const topLabel = top ? DOMAIN_LABEL[top[0]] : null;
  const bottomLabel = bottom ? DOMAIN_LABEL[bottom[0]] : null;

  return (
    `${childName}은(는) 이번 학기 총 ${entries.length}건의 관찰 기록을 남겼습니다. ` +
    (topLabel
      ? `그중 ${topLabel} 영역에서 가장 활발한 모습을 보였으며, 관련 활동에 꾸준한 관심을 나타냈습니다. `
      : "") +
    (bottomLabel && bottomLabel !== topLabel
      ? `상대적으로 ${bottomLabel} 영역의 관찰 빈도는 낮은 편으로, 다음 학기에는 관련 활동을 조금 더 계획해보면 좋겠습니다. `
      : "") +
    `전반적으로 또래와의 관계 속에서 꾸준히 성장하는 모습을 보이고 있어, 다음 학기에도 다양한 영역의 경험을 고르게 제공하는 것을 권장합니다.`
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const childName: string = body?.childName ?? "";
  const entries: EntryInput[] = Array.isArray(body?.entries) ? body.entries : [];

  if (entries.length === 0) {
    return NextResponse.json(
      { error: "요약할 관찰 기록이 없어요." },
      { status: 400 },
    );
  }

  const aiSummary = await callGroq(childName, entries);
  const summary = aiSummary ?? mockSummarize(childName, entries);

  return NextResponse.json({ summary, source: aiSummary ? "ai" : "mock" });
}
