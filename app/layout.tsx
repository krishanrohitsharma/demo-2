import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WealthFlow — Personal Finance Tracker",
  description: "Track your income, expenses, investments, and net worth in one place.",
  manifest: "/demo-2/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "WealthFlow" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/demo-2/icon-192.png" />
      </head>
      <body style={{ background: "#0a0a0f", color: "#f1f5f9", minHeight: "100vh" }}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
