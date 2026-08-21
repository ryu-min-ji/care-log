"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCareLogStore } from "@/lib/store";
import { DOMAIN_LABEL } from "@/lib/domains";
import { TONES } from "@/lib/tone";
import type { Entry } from "@/lib/types";

type Tab = "observation" | "parentMessage";

export default function NotePage() {
  const params = useParams<{ childId: string }>();
  const childId = params.childId;

  const children = useCareLogStore((s) => s.children);
  const addDraftEntry = useCareLogStore((s) => s.addDraftEntry);
  const updateEntry = useCareLogStore((s) => s.updateEntry);
  const saveEntry = useCareLogStore((s) => s.saveEntry);
  const entries = useCareLogStore((s) => s.entries);
  const tone = useCareLogStore((s) => s.tone);
  const setTone = useCareLogStore((s) => s.setTone);

  const child = children.find((c) => c.id === childId);

  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [tab, setTab] = useState<Tab>("observation");

  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(t);
  }, [loading]);

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

  async function handleGenerate() {
    if (memo.trim().length < 4) {
      setError("메모가 너무 짧아서 초안을 만들기 어려워요. 상황을 한 문장만 더 적어주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    setEntry(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: child!.name, memo, tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "초안을 만들지 못했어요. 다시 시도해주세요.");
        return;
      }
      const newEntry = addDraftEntry(child!.id, memo, data.result);
      setEntry(newEntry);
      setTab("observation");
    } catch {
      setError("초안을 만들지 못했어요. 네트워크 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function handleFieldChange(field: "observation" | "parentMessage", value: string) {
    if (!entry) return;
    const updated = { ...entry, [field]: value };
    setEntry(updated);
    updateEntry(entry.id, { [field]: value });
  }

  function handleSave() {
    if (!entry) return;
    saveEntry(entry.id);
    setEntry({ ...entry, status: "saved" });
  }

  function handleExportText() {
    if (!entry || !child) return;
    const text = `[관찰일지] ${child.name} (${child.className})\n영역: ${entry.domains
      .map((d) => DOMAIN_LABEL[d])
      .join(", ")}\n\n${entry.observation}\n\n---\n\n[학부모용 알림장]\n\n${entry.parentMessage}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${child.name}_관찰기록_${new Date(entry.createdAt).toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    window.print();
  }

  const childEntryCount = entries.filter((e) => e.childId === child.id).length;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-ink">
              오늘의 메모 — {child.name}
            </h1>
            <p className="text-xs text-ink/50">
              {child.className} · 이번 학기 관찰 {childEntryCount}건
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-ink/50">
              문체
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as typeof tone)}
                className="rounded-md border border-ink/15 bg-paper px-2 py-1 text-xs text-ink outline-none focus:border-ink-green"
              >
                {TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <Link href="/class" className="text-xs text-ink/50 hover:text-ink-green">
              ← 반 관리
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 블록 쌓기, 친구와 협동, 웃으며 완성, 자랑하듯 보여줌"
              rows={6}
              className="w-full resize-none rounded-lg border border-ink/15 p-4 text-sm leading-[1.7] outline-none transition-shadow focus:border-ink-green focus:ring-2 focus:ring-ink-green/20"
            />
            {error && <p className="mt-2 text-sm text-gold">{error}</p>}
            <Button
              onClick={handleGenerate}
              disabled={loading || memo.trim().length === 0}
              className="mt-4"
            >
              {loading ? "생성 중…" : "초안 만들기"}
            </Button>
          </div>

          <div>
            {loading && (
              <Card role="status" aria-live="polite" className="p-5">
                <p className="mb-4 text-sm text-ink/60">
                  메모를 읽고 있어요…{slow && " 조금만 더 기다려주세요"}
                </p>
                <div className="mb-3 flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            )}

            {!loading && !entry && (
              <Card className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-sm text-ink/40">
                  메모를 입력하고 초안을 만들어보세요
                </p>
              </Card>
            )}

            {!loading && entry && (
              <div>
                <div role="tablist" aria-label="결과 보기" className="mb-3 flex gap-2">
                  <button
                    role="tab"
                    aria-selected={tab === "observation"}
                    onClick={() => setTab("observation")}
                    className={`rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-green ${
                      tab === "observation"
                        ? "bg-ink-green text-paper"
                        : "border border-ink-green text-ink-green hover:bg-accent-soft"
                    }`}
                  >
                    관찰일지
                  </button>
                  <button
                    role="tab"
                    aria-selected={tab === "parentMessage"}
                    onClick={() => setTab("parentMessage")}
                    className={`rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-green ${
                      tab === "parentMessage"
                        ? "bg-ink-green text-paper"
                        : "border border-ink-green text-ink-green hover:bg-accent-soft"
                    }`}
                  >
                    학부모용 알림장
                  </button>
                </div>

                <Card className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {entry.domains.map((d) => (
                      <Badge key={d}>{DOMAIN_LABEL[d]}</Badge>
                    ))}
                    {entry.status === "draft" && (
                      <Badge tone="attention">확인 필요</Badge>
                    )}
                  </div>
                  <textarea
                    value={tab === "observation" ? entry.observation : entry.parentMessage}
                    onChange={(e) => handleFieldChange(tab, e.target.value)}
                    rows={8}
                    className="w-full resize-none rounded-lg border border-ink/10 bg-accent-soft/30 p-3 text-sm leading-[1.7] outline-none transition-shadow focus:border-ink-green focus:ring-2 focus:ring-ink-green/20"
                  />
                </Card>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={handleSave} disabled={entry.status === "saved"}>
                    {entry.status === "saved" ? "저장됨" : "저장"}
                  </Button>
                  <Button variant="secondary" onClick={handleExportPdf}>
                    PDF로 내보내기
                  </Button>
                  <Button variant="ghost" onClick={handleExportText}>
                    텍스트로 내보내기
                  </Button>
                </div>
                <p className="mt-2 text-xs text-ink/40">
                  AI가 만든 초안이에요. 저장 전에 내용을 꼭 확인해주세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {entry && (
          <div id="print-area" className="hidden print:block">
            <h2 className="font-display mb-1 text-2xl font-bold">
              {child.name} 관찰 기록
            </h2>
            <p className="mb-6 text-sm text-ink/60">
              {child.className} · {new Date(entry.createdAt).toLocaleDateString("ko-KR")} ·{" "}
              {entry.domains.map((d) => DOMAIN_LABEL[d]).join(", ")}
            </p>
            <h3 className="mb-2 text-lg font-bold">관찰일지</h3>
            <p className="mb-6 whitespace-pre-wrap text-sm leading-[1.7]">{entry.observation}</p>
            <h3 className="mb-2 text-lg font-bold">학부모용 알림장</h3>
            <p className="whitespace-pre-wrap text-sm leading-[1.7]">{entry.parentMessage}</p>
          </div>
        )}
      </main>
    </>
  );
}
