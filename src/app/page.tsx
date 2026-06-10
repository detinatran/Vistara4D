"use client";

import { useState } from "react";
import Link from "next/link";
import { LAYERS, UI, type Lang } from "@/lib/content";
import { LangToggle, QRModal, ShareModal } from "@/components/ui";

// Màu đại diện + icon cho 4 lớp (preview ở landing)
const LAYER_PREVIEW: { icon: string; from: string; to: string }[] = [
  { icon: "🌅", from: "#1f2d4d", to: "#c9a36a" },
  { icon: "🏛️", from: "#5fa8e8", to: "#cfe9ff" },
  { icon: "🏮", from: "#3a1d4d", to: "#e8702a" },
  { icon: "📜", from: "#2a241a", to: "#9c7b3f" },
];

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("vi");
  const [qr, setQr] = useState(false);
  const [share, setShare] = useState(false);
  const t = UI[lang];

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-muc text-giay">
      {/* ===== Nền nhiều lớp ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2747] via-[#7c2218] to-[#0e0b08]" />
      <div className="absolute inset-0 paper-grain opacity-25" />
      {/* hai vầng sáng động */}
      <div className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-vang/20 blur-[100px]" />
      <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-son/30 blur-[100px]" />
      {/* viền hoa văn mờ dưới đáy */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0e0b08] to-transparent" />

      {/* ===== Top bar ===== */}
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:py-5">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Vistara4D" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <span className="font-serif text-base font-semibold tracking-wide text-giay/95">
            Vistara<span className="text-vang">4D</span>
          </span>
        </div>
        <LangToggle lang={lang} onChange={setLang} />
      </header>

      {/* ===== Hero ===== */}
      <section className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 pt-4 text-center sm:pt-8">
        <div className="animate-fade-in-scale">
          <img
            src="/logo.png"
            alt="Vistara4D — Văn Miếu"
            className="mb-6 h-40 w-40 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] sm:h-48 sm:w-48"
          />
        </div>

        <p className="animate-float-up delay-1 mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-vang">
          {t.brandTagline}
        </p>
        <h1 className="animate-float-up delay-2 mb-4 text-balance font-serif text-[2.6rem] font-bold leading-[1.05] text-gradient-heritage sm:text-6xl">
          {t.heroTitle}
        </h1>
        <p className="animate-float-up delay-3 mb-9 max-w-md text-balance text-sm leading-relaxed text-giay/80 sm:text-base">
          {t.heroSub}
        </p>

        {/* CTA chính */}
        <div className="animate-float-up delay-4 flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/experience"
            className="group relative overflow-hidden rounded-2xl bg-son py-4 text-center text-base font-bold text-giay shadow-lg shadow-son/40 ring-1 ring-inset ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-son-light hover:shadow-xl hover:shadow-son/50 active:translate-y-0 active:scale-[0.98]"
          >
            {/* shimmer chạy qua nút */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">▶ {t.enterDemo}</span>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setQr(true)}
              className="rounded-2xl border border-giay/25 bg-white/[0.03] py-3 text-sm font-semibold text-giay/90 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-vang/40 hover:bg-white/[0.07] active:translate-y-0"
            >
              ▦ {t.scanQR}
            </button>
            <button
              onClick={() => setShare(true)}
              className="rounded-2xl border border-giay/25 bg-white/[0.03] py-3 text-sm font-semibold text-giay/90 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-vang/40 hover:bg-white/[0.07] active:translate-y-0"
            >
              ↗ {t.share}
            </button>
          </div>
        </div>
      </section>

      {/* ===== About + 4 lớp thời gian ===== */}
      <section className="relative z-10 mx-auto mt-12 max-w-xl px-6 pb-16 sm:mt-16">
        <div className="animate-fade-in delay-5 glass rounded-3xl p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-vang/40" />
            <h2 className="font-serif text-lg font-semibold text-vang">{t.aboutTitle}</h2>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-vang/40" />
          </div>
          <p className="text-center text-sm leading-relaxed text-giay/75">{t.aboutBody}</p>

          {/* 4 lớp — card có gradient riêng */}
          <div className="mt-5 grid grid-cols-4 gap-2.5">
            {LAYERS.map((l, i) => {
              const p = LAYER_PREVIEW[i];
              return (
                <div
                  key={l.id}
                  className="group overflow-hidden rounded-xl border border-white/10 text-center transition-transform hover:-translate-y-1"
                >
                  <div
                    className="flex h-12 items-center justify-center text-xl transition-transform group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  >
                    {p.icon}
                  </div>
                  <div className="bg-black/30 py-1.5 text-[9px] font-medium leading-tight text-giay/80 sm:text-[10px]">
                    {l[lang].name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* dòng nhận diện nhỏ */}
        <p className="mt-6 text-center text-[11px] text-giay/35">
          MVP · Văn Miếu in Motion — Web 4D demo
        </p>
      </section>

      <QRModal open={qr} onClose={() => setQr(false)} t={t} />
      <ShareModal open={share} onClose={() => setShare(false)} t={t} />
    </main>
  );
}
