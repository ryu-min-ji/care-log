"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCareLogStore } from "@/lib/store";

export default function ClassPage() {
  const children = useCareLogStore((s) => s.children);
  const entries = useCareLogStore((s) => s.entries);
  const addChild = useCareLogStore((s) => s.addChild);

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [showForm, setShowForm] = useState(children.length === 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !className.trim()) return;
    addChild(name, className);
    setName("");
    setClassName("");
    setShowForm(false);
  }

  function countFor(childId: string) {
    return entries.filter((e) => e.childId === childId).length;
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-ink">반 · 원아 등록</h1>
        <p className="mt-2 text-sm text-ink/60">
          이름과 반만 입력하면 바로 관찰 기록을 시작할 수 있어요.
        </p>

        {children.length === 0 && !showForm ? null : (
          <div className="mt-8 space-y-3">
            {children.map((child) => (
              <Card
                key={child.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-full bg-accent-soft" aria-hidden />
                  <div>
                    <p className="font-medium text-ink">{child.name}</p>
                    <p className="text-xs text-ink/50">
                      {child.className} · 관찰 {countFor(child.id)}건
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/dashboard/${child.id}`}>
                    <Button variant="ghost" className="px-3 py-1.5 text-xs">
                      커버리지
                    </Button>
                  </Link>
                  <Link href={`/note/${child.id}`}>
                    <Button variant="secondary" className="px-3 py-1.5 text-xs">
                      메모 입력
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {children.length === 0 && !showForm && (
          <Card className="mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
            <p className="text-sm text-ink/60">첫 원아를 등록해보세요</p>
            <Button onClick={() => setShowForm(true)}>+ 원아 추가</Button>
          </Card>
        )}

        {showForm ? (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-3 rounded-xl border border-dashed border-ink/20 p-5"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">이름</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김이든"
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none transition-shadow focus:border-ink-green focus:ring-2 focus:ring-ink-green/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">반</label>
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="예: 만 3세반"
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none transition-shadow focus:border-ink-green focus:ring-2 focus:ring-ink-green/20"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit">등록</Button>
              {children.length > 0 && (
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  취소
                </Button>
              )}
            </div>
          </form>
        ) : (
          children.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 w-full rounded-lg border border-dashed border-ink/25 py-3 text-sm text-ink/50 hover:border-ink-green hover:text-ink-green"
            >
              + 원아 추가
            </button>
          )
        )}
      </main>
    </>
  );
}
