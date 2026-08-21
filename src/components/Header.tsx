import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-ink-green">
          Care Log
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink/70">
          <Link href="/#features" className="hidden hover:text-ink-green sm:inline">
            기능
          </Link>
          <Link href="/#pricing" className="hidden hover:text-ink-green sm:inline">
            가격
          </Link>
          <Link href="/class" className="hover:text-ink-green">
            반 관리
          </Link>
        </nav>
      </div>
    </header>
  );
}
