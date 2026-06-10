import type { Metadata, Viewport } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Heading: serif sang trọng, cổ điển — gợi không khí di sản
const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-serif",
  display: "swap",
});

// Body: sans hỗ trợ tiếng Việt tốt, hiện đại, dễ đọc trên mobile
const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
