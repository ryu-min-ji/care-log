import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const FEATURES = [
  {
    title: "AI 관찰일지 초안",
    description:
      "메모 한 줄만 남기면 관찰 내용과 해석, 다음 지원계획까지 담긴 관찰일지 초안을 만들어드려요.",
  },
  {
    title: "5개 영역 자동 태깅",
    description:
      "표준보육과정 5개 영역 중 어디에 해당하는지 자동으로 분류하고, 원아별 커버리지를 한눈에 확인해요.",
  },
  {
    title: "이중 산출물 생성",
    description:
      "같은 메모를 학부모가 읽기 편한 알림장 문장으로도 원클릭으로 바꿔드려요.",
  },
];

const PLANS = [
  {
    name: "FREE",
    price: "₩0",
    period: "",
    features: ["반 1개, 원아 10명까지", "월 관찰일지 생성 10건", "텍스트 내보내기"],
    highlight: false,
  },
  {
    name: "PRO · 개인",
    price: "₩5,900",
    period: "/월",
    features: [
      "무제한 생성",
      "학부모용 알림장 변환",
      "커버리지 대시보드",
      "문체 프로필 저장",
    ],
    highlight: true,
  },
  {
    name: "TEAM · 원 단위",
    price: "₩49,000",
    period: "/월",
    features: ["교사 5인까지 포함", "원장용 통합 대시보드", "평가인증 서류 내보내기"],
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="flex flex-col items-center px-6 py-24 text-center">
          <p className="mb-4 text-sm font-medium tracking-wide text-ink-green">
            AI 관찰일지 · 알림장
          </p>
          <h1 className="font-display max-w-2xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            메모 한 줄, 완성된 기록 두 개
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[1.7] text-ink/70">
            활동 중 남긴 짧은 메모가 표준보육과정 기준 관찰일지와 학부모용 알림장
            문장으로 동시에 바뀝니다.
          </p>
          <Link href="/class" className="mt-10">
            <Button className="px-8 py-3 text-base">무료로 시작하기</Button>
          </Link>
        </section>

        <section id="features" className="scroll-mt-20 border-t border-ink/10 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-center text-2xl font-bold text-ink">
              기능
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <Card key={f.title} className="p-6">
                  <h3 className="mb-2 font-medium text-ink">{f.title}</h3>
                  <p className="text-sm leading-[1.7] text-ink/60">{f.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-t border-ink/10 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-center text-2xl font-bold text-ink">
              가격
            </h2>
            <p className="mt-2 text-center text-xs text-ink/40">
              베타 단계 가정 가격이며 추후 조정될 수 있어요.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <Card
                  key={plan.name}
                  className={`flex flex-col p-6 ${
                    plan.highlight ? "border-ink-green ring-1 ring-ink-green" : ""
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium tracking-wide text-ink/50">
                      {plan.name}
                    </span>
                    {plan.highlight && <Badge>추천</Badge>}
                  </div>
                  <p className="mb-4">
                    <span className="text-2xl font-bold text-ink">{plan.price}</span>
                    <span className="text-sm text-ink/50">{plan.period}</span>
                  </p>
                  <ul className="space-y-2 text-sm text-ink/70">
                    {plan.features.map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
