"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LAYERS, UI, type Lang, type TimeLayer, type UIStrings } from "@/lib/content";
import { EvidencePanel, LangToggle, QRModal, ShareModal } from "@/components/ui";
import { MODEL_CREDITS } from "@/lib/credits";

// R3F không SSR được — load phía client
const Viewer4D = dynamic(() => import("@/components/Viewer4D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#1f2d4d] via-[#5a3a2a] to-[#0e0b08]">
      <img src="/logo.png" alt="" className="h-16 w-16 animate-pulse object-contain opacity-80" />
      <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 shimmer rounded-full" />
      </div>
      <div className="text-xs tracking-wide text-giay/50">Đang dựng không gian 4D…</div>
    </div>
  ),
});

const reconLayer = LAYERS.find((l) => l.reconstruction)!;

export default function ExperiencePage() {
  const [lang, setLang] = useState<Lang>("vi");
  // pos: vị trí liên tục 0..(n-1) trên dòng thời gian (cho crossfade mượt)
  const [pos, setPos] = useState(1); // mặc định: giờ tham quan
  const [festival, setFestival] = useState(false);
  const [thenNow, setThenNow] = useState(false);
  const [split, setSplit] = useState(0.5);
  const [storyOpen, setStoryOpen] = useState(true);
  const [qr, setQr] = useState(false);
  const [share, setShare] = useState(false);
  const [intro, setIntro] = useState(true); // overlay onboarding khi mới vào

  const t = UI[lang];

  // Tách pos thành lớp gần nhất + blend
  const idx = Math.round(pos);
  const layer = LAYERS[idx];
  const lower = Math.floor(pos);
  const upper = Math.min(lower + 1, LAYERS.length - 1);
  const blendRaw = pos - lower;
  // Lớp hiển thị chính + lớp trước để crossfade palette
  const dispLayer = LAYERS[upper];
  const prevLayer = LAYERS[lower];
  const blend = blendRaw;

  const ld = layer[lang];

  // Festival chỉ khả dụng nếu lớp hỗ trợ
  const festivalAvailable = layer.festivalCapable;
  useEffect(() => {
    if (!festivalAvailable && festival) setFestival(false);
  }, [festivalAvailable, festival]);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-muc text-giay select-none">
      {/* ---------- 4D Viewer (lõi trải nghiệm) ---------- */}
      <Viewer4D
        layer={dispLayer}
        prevLayer={prevLayer}
        blend={blend}
        festival={festival}
        compareLayer={thenNow ? reconLayer : null}
        compareSplit={split}
        lang={lang}
      />

      {/* Vignette + grain phủ trên cảnh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* ---------- Top bar ---------- */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 sm:p-4">
        <Link
          href="/"
          className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:ring-heritage"
        >
          <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
          <span className="font-serif text-xs font-semibold tracking-wide">
            Vistara<span className="text-vang">4D</span>
          </span>
        </Link>
        <div className="pointer-events-auto">
          <LangToggle lang={lang} onChange={setLang} />
        </div>
      </header>

      {/* Badge phục dựng dựa trên tư liệu */}
      {layer.reconstruction && !thenNow && (
        <div className="pointer-events-none absolute left-1/2 top-16 z-20 -translate-x-1/2 animate-fade-in">
          <span className="rounded-full border border-vang/40 bg-black/50 px-3 py-1 text-[11px] font-semibold text-vang backdrop-blur">
            ⚑ {t.reconBadge}
          </span>
        </div>
      )}

      {/* Then & Now nhãn 2 bên + tay kéo */}
      {thenNow && (
        <ThenNowOverlay split={split} setSplit={setSplit} t={t} />
      )}

      {/* Gợi ý thao tác xoay */}
      {!thenNow && (
        <div className="pointer-events-none absolute bottom-44 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] text-giay/40">
          {t.dragHint}
        </div>
      )}

      {/* ---------- Story Layer panel (trái) ---------- */}
      <aside
        className={`absolute left-0 top-1/2 z-20 w-[82vw] max-w-sm -translate-y-1/2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          storyOpen ? "translate-x-0" : "-translate-x-[calc(100%-2.25rem)]"
        }`}
      >
        <div className="glass m-3 max-h-[72vh] overflow-y-auto rounded-3xl p-4 hide-scrollbar">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-vang">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vang" />
              {layer.clock} · {t.story}
            </span>
            <button
              onClick={() => setStoryOpen((s) => !s)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-giay/20 text-sm text-giay/60 transition hover:bg-giay/10 hover:text-giay"
              aria-label="toggle story"
            >
              {storyOpen ? "‹" : "›"}
            </button>
          </div>
          <h2 className="mb-1 font-serif text-2xl font-semibold text-giay">{ld.name}</h2>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-son-light">
            {ld.tagline}
          </p>
          <p className="mb-3 text-sm leading-relaxed text-giay/85">{ld.story}</p>

          {/* Captions */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {ld.captions.map((c, i) => (
              <span
                key={i}
                className="rounded-full border border-giay/10 bg-giay/5 px-2.5 py-1 text-[10px] text-giay/75"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Evidence (chỉ lớp phục dựng) — nền tảng Then & Now có kiểm chứng */}
          {layer.reconstruction && <EvidencePanel layer={layer} lang={lang} t={t} />}
        </div>
      </aside>

      {/* ---------- Cụm điều khiển dưới ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-5">
        {/* Hàng nút phụ */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <ControlBtn
            active={thenNow}
            onClick={() => setThenNow((s) => !s)}
            label={t.thenNow}
            icon="◐"
          />
          <ControlBtn
            active={festival}
            disabled={!festivalAvailable}
            onClick={() => setFestival((s) => !s)}
            label={festival ? t.festivalOn : t.festival}
            icon="🏮"
          />
          <ControlBtn onClick={() => setQr(true)} label="QR" icon="▦" />
          <ControlBtn onClick={() => setShare(true)} label={t.share} icon="↗" />
        </div>

        {/* Time Slider */}
        <div className="glass mx-auto max-w-2xl rounded-3xl p-4">
          <div className="mb-2.5 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 uppercase tracking-widest text-vang">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vang" />
              {t.timeline}
            </span>
            <span className="font-serif text-sm text-giay/90">{ld.name}</span>
          </div>
          <input
            type="range"
            className="time-range w-full"
            min={0}
            max={LAYERS.length - 1}
            step={0.01}
            value={pos}
            onChange={(e) => setPos(parseFloat(e.target.value))}
            aria-label={t.timeline}
          />
          {/* Nhãn các mốc — bấm để nhảy */}
          <div className="mt-2.5 flex gap-1">
            {LAYERS.map((l, i) => {
              const isActive = Math.round(pos) === i;
              return (
                <button
                  key={l.id}
                  onClick={() => setPos(i)}
                  className={`flex-1 rounded-lg px-1 py-1 text-center font-serif text-[11px] leading-tight transition ${
                    isActive
                      ? "bg-son/20 font-semibold text-giay ring-1 ring-inset ring-son/40"
                      : "text-giay/45 hover:bg-white/5 hover:text-giay/75"
                  }`}
                >
                  <span className="block text-[9px] opacity-70">{l.clock}</span>
                  <span className="block">{l[lang].name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Credit model 3D (CC-BY yêu cầu ghi công tác giả Sketchfab) */}
      <div className="pointer-events-none absolute bottom-1 right-2 z-10 text-[9px] text-giay/30">
        {MODEL_CREDITS.map((c, i) => (
          <a
            key={c.file}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto hover:text-giay/60"
          >
            {i > 0 && " · "}
            {c.title} © {c.author}
          </a>
        ))}
      </div>

      <QRModal open={qr} onClose={() => setQr(false)} t={t} />
      <ShareModal open={share} onClose={() => setShare(false)} t={t} />

      {/* ---------- Intro / onboarding overlay ---------- */}
      {intro && <IntroOverlay t={t} onStart={() => setIntro(false)} />}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Intro overlay: chào mừng + 3 tip thao tác. Hiện 1 lần khi vào trang.
function IntroOverlay({ t, onStart }: { t: UIStrings; onStart: () => void }) {
  const tips: [string, string][] = [
    ["🖐️", t.tipDrag],
    ["⏱️", t.tipSlider],
    ["🎚️", t.tipModes],
  ];
  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-5 backdrop-blur-md">
      <div className="animate-fade-in-scale glass-strong w-full max-w-sm rounded-3xl p-6 text-center">
        <img
          src="/logo.png"
          alt=""
          className="mx-auto mb-4 h-20 w-20 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)]"
        />
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-vang">
          Vistara4D
        </p>
        <h2 className="mb-2 font-serif text-2xl font-semibold text-gradient-heritage">
          {t.introTitle}
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-giay/80">{t.introSub}</p>

        <div className="mb-6 space-y-2.5 text-left">
          {tips.map(([icon, text], i) => (
            <div
              key={i}
              className="animate-float-up flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-xs leading-relaxed text-giay/85">{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="group relative w-full overflow-hidden rounded-2xl bg-son py-3.5 text-base font-bold text-giay shadow-lg shadow-son/40 transition hover:bg-son-light active:scale-[0.98]"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">▶ {t.introStart}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function ControlBtn({
  active,
  disabled,
  onClick,
  label,
  icon,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 ${
        disabled
          ? "cursor-not-allowed border-giay/10 text-giay/25"
          : active
          ? "border-son bg-son text-giay shadow-lg shadow-son/40 ring-1 ring-inset ring-white/15"
          : "border-giay/20 bg-black/35 text-giay/85 hover:-translate-y-0.5 hover:border-vang/40 hover:bg-black/55"
      }`}
    >
      <span className="text-sm leading-none">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Then & Now: tay kéo split + nhãn 2 phía
function ThenNowOverlay({
  split,
  setSplit,
  t,
}: {
  split: number;
  setSplit: (n: number) => void;
  t: UIStrings;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function move(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    setSplit(Math.min(0.92, Math.max(0.08, x)));
  }

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      move(clientX);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 z-10">
      {/* Nhãn 2 phía */}
      <div className="pointer-events-none absolute left-4 top-20 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-giay backdrop-blur">
        {t.then}
      </div>
      <div className="pointer-events-none absolute right-4 top-20 rounded-full bg-vang/80 px-3 py-1 text-xs font-semibold text-muc backdrop-blur">
        {t.now}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-32 -translate-x-1/2 text-center text-[10px] text-giay/50">
        {t.thenNowHint}
      </div>

      {/* Đường chia + tay kéo */}
      <div
        className="absolute inset-y-0 w-0.5 bg-vang/80 shadow-[0_0_12px_rgba(212,162,78,0.6)]"
        style={{ left: `${split * 100}%` }}
      >
        <button
          className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-vang bg-muc text-vang shadow-lg"
          onMouseDown={() => (dragging.current = true)}
          onTouchStart={() => (dragging.current = true)}
        >
          ⟷
        </button>
      </div>
    </div>
  );
}
