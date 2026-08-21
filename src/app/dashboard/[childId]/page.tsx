"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { useCareLogStore } from "@/lib/store";
import { DOMAINS } from "@/lib/domains";

export default function DashboardPage() {
  const params = useParams<{ childId: string }>();
  const childId = params.childId;

  const children = useCareLogStore((s) => s.children);
  const entries = useCareLogStore((s) => s.entries);

  const child = children.find((c) => c.id === childId);
  const childEntries = entries.filter((e) => e.childId === childId);

  if (!child) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16 text-center">
          <p className="text-sm text-ink/60">원아 정보를 찾을 수 없어요.</p>
          <Link href="/class" className="mt-4 inline-block text-sm text-ink-green underline">
            반 관리로 돌아가기
          </Link>
        </main>
      </>
    );
  }

  const totalTags = childEntries.reduce((sum, e) => sum + e.domains.length, 0);
  const counts = DOMAINS.map((d) => {
    const count = childEntries.filter((e) => e.domains.includes(d.id)).length;
    const pct = totalTags > 0 ? Math.round((count / totalTags) * 100) : 0;
    return { ...d, count, pct };
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-ink">
              이번 학기 · {child.name} · 영역별 관찰 비중
            </h1>
            <p className="text-xs text-ink/50">
              {child.className} · 관찰 {childEntries.length}건
            </p>
          </div>
          <Link href={`/note/${child.id}`} className="text-xs text-ink/50 hover:text-ink-green">
            메모 입력 →
          </Link>
        </div>

        {childEntries.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="text-sm text-ink/60">아직 관찰 기록이 없어요.</p>
            <Link href={`/note/${child.id}`} className="text-sm text-ink-green underline">
              첫 메모 남기러 가기
            </Link>
          </Card>
        ) : (
          <Card className="space-y-5 p-6">
            {counts.map((d) => (
              <div key={d.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-ink">{d.label}</span>
                  <span className="text-ink/50">{d.pct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-accent-soft">
                  <div
                    className="h-full rounded-full bg-ink-green"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        )}
      </main>
    </>
  );
}
