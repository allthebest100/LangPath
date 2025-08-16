import "./globals.css";
import type { Metadata } from "next";
import NavHeader from "../components/NavHeader";

export const metadata: Metadata = {
  title: "LangPath",
  description: "A multilingual chatbot and learning hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        {/* Global navigation header */}
        <NavHeader />

        {/* Main content area, add top padding to avoid being hidden by fixed header */}
        <main className="pt-20 min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}
