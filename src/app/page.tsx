import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
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
      </main>
    </>
  );
}
