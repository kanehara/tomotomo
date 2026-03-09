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
    <html lang="en">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
