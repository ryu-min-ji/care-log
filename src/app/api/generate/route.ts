import { NextResponse } from "next/server";
import { DOMAINS, isDomainId, type DomainId } from "@/lib/domains";
import { mockGenerate } from "@/lib/mockGenerate";
import type { GenerateResult } from "@/lib/types";

const MODEL = "llama-3.3-70b-versatile";

function buildSystemPrompt(): string {
  const domainList = DOMAINS.map((d) => `${d.id}(${d.label})`).join(", ");
  return `당신은 보육교사의 짧은 메모를 표준보육과정 기준 관찰일지와 학부모용 알림장으로 바꿔주는 보조 도구입니다.
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "domains": ["${domainList} 중 해당하는 1~2개의 id"],
  "observation": "표준보육과정 관찰일지 문체. 관찰 내용과 해석, 다음 지원계획을 포함한 3~4문장의 존댓말 전문 문장",
  "parentMessage": "학부모가 읽기 편한 다정한 어조의 2~3문장 알림장 문장"
}`;
}

async function callGroq(childName: string, memo: string): Promise<GenerateResult | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        temperature: 0.6,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          {
            role: "user",
            content: `원아 이름: ${childName}\n교사 메모: ${memo}`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const domains: DomainId[] = Array.isArray(parsed.domains)
      ? parsed.domains.filter(isDomainId)
      : [];

    if (
      domains.length === 0 ||
      typeof parsed.observation !== "string" ||
      typeof parsed.parentMessage !== "string"
    ) {
      return null;
    }

    return {
      domains: domains.slice(0, 2),
      observation: parsed.observation,
      parentMessage: parsed.parentMessage,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const childName: string = body?.childName ?? "";
  const memo: string = body?.memo ?? "";

  if (memo.trim().length < 4) {
    return NextResponse.json(
      { error: "메모가 너무 짧아서 초안을 만들기 어려워요. 상황을 한 문장만 더 적어주세요." },
      { status: 400 },
    );
  }

  const aiResult = await callGroq(childName, memo);
  const result = aiResult ?? mockGenerate(childName, memo);

  return NextResponse.json({ result, source: aiResult ? "ai" : "mock" });
}
