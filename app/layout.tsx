import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/LocaleContext";

export const metadata: Metadata = {
  title: "tomotomo — Event RSVP",
  description: "Create events, share QR codes, and collect RSVPs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-50 text-gray-900">
      <body className="min-h-screen flex flex-col items-center px-4 py-8">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
