
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "../store/StoreContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "PalletWholesale Pro - مستر هيرو",
  description: "منصة مبيعات الجملة ونظام الطبليات وتصفيات المخازن العالمية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} font-sans`}>
      <body className="bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
