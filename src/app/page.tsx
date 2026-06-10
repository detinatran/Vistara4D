"use client";

import { useState } from "react";
import Link from "next/link";
import { UI, type Lang } from "@/lib/content";
import { LangToggle, QRModal, ShareModal } from "@/components/ui";

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("vi");
  const [qr, setQr] = useState(false);
  const [share, setShare] = useState(false);
  const t = UI[lang];

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-muc text-giay">
      {/* Nền gradient di sản + hoa văn */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f2d4d] via-[#8A2417] to-[#0e0b08]" />
      <div className="absolute inset-0 paper-grain opacity-30" />
      {/* vầng sáng sau logo */}
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-vang/20 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Vistara4D" className="h-9 w-9 object-contain" />
          <span className="font-serif text-sm tracking-wide text-giay/90">VISTARA4D</span>
        </div>
        <LangToggle lang={lang} onChange={setLang} />
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 pt-6 text-center">
        <img
          src="/logo.png"
          alt="Vistara4D — Văn Miếu"
          className="mb-6 h-44 w-44 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-fade-in"
        />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-vang animate-fade-in">
          {t.brandTagline}
        </p>
        <h1 className="mb-4 font-serif text-4xl font-bold leading-tight sm:text-5xl animate-fade-in">
          {t.heroTitle}
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-giay/80 animate-fade-in">
          {t.heroSub}
        </p>

        {/* CTA chính */}
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/experience"
            className="rounded-2xl bg-son py-4 text-center text-base font-bold text-giay shadow-lg shadow-son/30 transition hover:bg-son-light active:scale-95"
          >
            ▶ {t.enterDemo}
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setQr(true)}
              className="rounded-2xl border border-giay/30 py-3 text-sm font-semibold text-giay/90 transition hover:bg-giay/10 active:scale-95"
            >
              ▦ {t.scanQR}
            </button>
            <button
              onClick={() => setShare(true)}
              className="rounded-2xl border border-giay/30 py-3 text-sm font-semibold text-giay/90 transition hover:bg-giay/10 active:scale-95"
            >
              ↗ {t.share}
            </button>
          </div>
        </div>
      </section>

      {/* About + 4 lớp thời gian giới thiệu */}
      <section className="relative z-10 mx-auto mt-12 max-w-xl px-6 pb-16">
        <div className="rounded-2xl border border-giay/15 bg-black/30 p-5 backdrop-blur">
          <h2 className="mb-2 font-serif text-lg text-vang">{t.aboutTitle}</h2>
          <p className="text-sm leading-relaxed text-giay/75">{t.aboutBody}</p>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] text-giay/70">
            {[
              ["🌅", lang === "vi" ? "Sáng sớm" : "Dawn"],
              ["🏛️", lang === "vi" ? "Tham quan" : "Visit"],
              ["🏮", lang === "vi" ? "Mùa thi" : "Festival"],
              ["📜", lang === "vi" ? "Khoa cử" : "Imperial"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-lg bg-giay/5 py-2">
                <div className="text-lg">{icon}</div>
                <div className="mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QRModal open={qr} onClose={() => setQr(false)} t={t} />
      <ShareModal open={share} onClose={() => setShare(false)} t={t} />
    </main>
  );
}
