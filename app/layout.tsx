import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "家庭点餐",
  description: "适合家庭共享使用的移动端点餐系统",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <div className="mx-auto min-h-dvh max-w-3xl bg-background">{children}</div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
