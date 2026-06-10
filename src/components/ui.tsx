"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang, TimeLayer, UIStrings } from "@/lib/content";

// ---------------------------------------------------------------------------
// Toggle ngôn ngữ VN / EN
// ---------------------------------------------------------------------------
export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-full border border-giay/30 bg-black/30 p-0.5 backdrop-blur text-xs font-semibold">
      {(["vi", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`rounded-full px-3 py-1 transition ${
            lang === l ? "bg-son text-giay" : "text-giay/70 hover:text-giay"
          }`}
        >
          {l === "vi" ? "VI" : "EN"}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal khung chung
// ---------------------------------------------------------------------------
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-vang/30 bg-muc paper-grain p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-lg text-vang">{title}</h3>
          <button onClick={onClose} className="text-giay/60 hover:text-giay text-xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Share / Export Clip modal
// ---------------------------------------------------------------------------
export function ShareModal({
  open,
  onClose,
  t,
}: {
  open: boolean;
  onClose: () => void;
  t: UIStrings;
}) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={t.shareTitle}>
      <p className="mb-4 text-sm text-giay/80">{t.shareDesc}</p>

      {/* Preview khung clip có brand */}
      <div className="relative mb-4 aspect-[9/16] max-h-64 overflow-hidden rounded-xl bg-gradient-to-b from-son/40 to-muc">
        <div className="absolute inset-0 flex items-center justify-center text-giay/40 text-sm">
          ▶ 0:15
        </div>
        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
          <span className="text-[10px] font-bold text-giay">VISTARA4D</span>
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-[10px] text-giay/90">
          #VanMieu #MyHeritageMoment #Vistara4D
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button className="rounded-xl bg-son py-2.5 text-sm font-semibold text-giay hover:bg-son-light transition">
          {t.exportClip}
        </button>
        <button
          onClick={copyLink}
          className="rounded-xl border border-giay/30 py-2.5 text-sm font-semibold text-giay hover:bg-giay/10 transition"
        >
          {copied ? `✓ ${t.copied}` : t.copyLink}
        </button>
      </div>
      <p className="mt-3 text-center text-[10px] text-giay/40">
        Demo · export là tính năng mô phỏng trong MVP
      </p>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// QR Experience modal — sinh QR trỏ về URL hiện tại
// ---------------------------------------------------------------------------
export function QRModal({
  open,
  onClose,
  t,
}: {
  open: boolean;
  onClose: () => void;
  t: UIStrings;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const url = typeof window !== "undefined" ? window.location.href : "https://vistara4d.demo";
    import("qrcode").then((QR) => {
      QR.toDataURL(url, { margin: 1, width: 360, color: { dark: "#2A2018", light: "#F4ECDD" } }).then(
        (d) => {
          if (!cancelled) setDataUrl(d);
        }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={t.qrTitle}>
      <p className="mb-4 text-sm text-giay/80">{t.qrDesc}</p>
      <div className="mx-auto mb-3 w-fit rounded-xl bg-giay p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR" className="h-48 w-48" />
        ) : (
          <div className="h-48 w-48 animate-pulse rounded bg-giayDark" />
        )}
      </div>
      <p className="text-center text-[11px] text-giay/50">Văn Miếu · Time Capsule #01</p>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Then & Now — bảng kiểm chứng (nguồn + độ tin cậy + tác giả)
// ---------------------------------------------------------------------------
export function EvidencePanel({ layer, lang, t }: { layer: TimeLayer; lang: Lang; t: UIStrings }) {
  const ev = layer.evidence;
  if (!ev) return null;

  const levelColor: Record<string, string> = {
    data: "bg-reu",
    infer: "bg-vang",
    illustrate: "bg-son",
  };
  const levelLabel: Record<string, string> = {
    data: t.legendData,
    infer: t.legendInfer,
    illustrate: t.legendIllustrate,
  };

  return (
    <div className="rounded-xl border border-vang/20 bg-black/40 p-3 text-xs backdrop-blur">
      {/* Confidence */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-giay/80">
          <span>{t.confidence}</span>
          <span className="font-bold text-vang">{ev.confidence}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-giay/10">
          <div className="h-full bg-gradient-to-r from-reu via-vang to-son" style={{ width: `${ev.confidence}%` }} />
        </div>
      </div>

      {/* Breakdown mức độ chắc chắn */}
      <div className="mb-3 space-y-1">
        {ev.breakdown.map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-giay/80">
            <span className={`h-2 w-2 shrink-0 rounded-full ${levelColor[b.level]}`} />
            <span className="flex-1">{b.label[lang]}</span>
            <span className="text-[10px] text-giay/50">{levelLabel[b.level]}</span>
          </div>
        ))}
      </div>

      {/* Nguồn tư liệu */}
      <div className="mb-2">
        <div className="mb-1 font-semibold text-giay/70">{t.sources}</div>
        <ul className="list-inside list-disc space-y-0.5 text-giay/70">
          {ev.sources.map((s, i) => (
            <li key={i}>{s[lang]}</li>
          ))}
        </ul>
      </div>

      <div className="border-t border-giay/10 pt-2 text-[10px] text-giay/50">
        {t.author}: {ev.author} · {ev.version} · {ev.updated}
      </div>
    </div>
  );
}
