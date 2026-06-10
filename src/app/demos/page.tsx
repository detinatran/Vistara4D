"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMOS, type DemoItem } from "@/lib/demos";
import { UI, type Lang } from "@/lib/content";
import { LangToggle } from "@/components/ui";

export default function DemosPage() {
  const [lang, setLang] = useState<Lang>("vi");
  const t = UI[lang];

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-muc text-giay">
      {/* Nền */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2747] via-[#5a2a1e] to-[#0e0b08]" />
      <div className="absolute inset-0 paper-grain opacity-20" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-vang/15 blur-[110px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-5 sm:px-6">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
            <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
            <span className="font-serif text-xs font-semibold tracking-wide">
              Vistara<span className="text-vang">4D</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/experience"
              className="hidden rounded-full border border-giay/25 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-giay/90 transition hover:border-vang/40 sm:inline-block"
            >
              ▶ {t.enterDemo}
            </Link>
            <LangToggle lang={lang} onChange={setLang} />
          </div>
        </header>

        {/* Hero + note */}
        <section className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)]">
          <div className="glass animate-fade-in relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <p className="relative mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-vang">
              Google D4RT · MegaSAM · 4D Gaussian Splatting
            </p>
            <h1 className="relative mb-3 font-serif text-4xl font-bold leading-[1.05] text-gradient-heritage sm:text-5xl">
              {t.demosTitle}
            </h1>
            <p className="relative max-w-xl text-sm leading-relaxed text-giay/80 sm:text-base">
              {t.demosSub}
            </p>
          </div>

          <aside className="glass animate-fade-in delay-2 flex flex-col gap-3 rounded-3xl p-5">
            <h2 className="font-serif text-lg font-semibold text-vang">{t.demosNoteTitle}</h2>
            <div className="rounded-xl bg-vang/90 p-4 text-[13px] font-medium leading-relaxed text-[#5a3d00]">
              {t.demosNote}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-serif text-2xl font-bold text-vang">{DEMOS.length}</div>
                <div className="mt-1 text-[11px] leading-tight text-giay/70">
                  {lang === "vi" ? "hình động về cảnh & chuyển động" : "scene & motion clips"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-serif text-2xl font-bold text-vang">4D</div>
                <div className="mt-1 text-[11px] leading-tight text-giay/70">
                  {lang === "vi" ? "góc nhìn, tuyến tham quan, depth" : "viewpoint, route, depth"}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Gallery */}
        <section className="grid gap-5 md:grid-cols-2">
          {DEMOS.map((item, i) => (
            <DemoCard key={item.media} item={item} index={i} lang={lang} openSource={t.openSource} />
          ))}
        </section>

        <p className="mt-8 text-center text-[11px] text-giay/35">
          Nguồn nghiên cứu công khai · phụ lục kỹ thuật Vistara4D
        </p>
      </div>
    </main>
  );
}

function DemoCard({
  item,
  index,
  lang,
  openSource,
}: {
  item: DemoItem;
  index: number;
  lang: Lang;
  openSource: string;
}) {
  return (
    <article className="glass animate-fade-in grid overflow-hidden rounded-2xl sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="relative min-h-[220px] bg-[#0a0705]">
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-vang/95 px-2.5 py-1 text-[11px] font-bold text-[#5a3d00]">
          {item.source}
        </span>
        {item.mode === "gif" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.media}
            alt={item.title}
            loading="lazy"
            className="h-full min-h-[220px] w-full object-cover"
          />
        ) : (
          <video
            src={item.media}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            className="h-full min-h-[220px] w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-between gap-3 p-4">
        <div>
          <h3 className="font-serif text-lg font-semibold leading-tight text-giay">
            {index + 1}. {item.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-giay/70">{item.desc[lang]}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-son/15 px-2.5 py-1 text-[11px] font-semibold text-son-light">
            {item.point}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-semibold text-vang transition hover:underline"
          >
            {openSource} ↗
          </a>
        </div>
      </div>
    </article>
  );
}
