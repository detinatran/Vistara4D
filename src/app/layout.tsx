import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vistara4d.demo"),
  title: "Vistara4D — Văn Miếu in Motion",
  description:
    "Vietnam Heritage in Motion. Trải nghiệm Văn Miếu qua không gian, chuyển động và thời gian. Sống cùng di sản Việt.",
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Vistara4D — Văn Miếu in Motion",
    description: "Vietnam Heritage in Motion · Sống cùng di sản Việt",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0b08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
