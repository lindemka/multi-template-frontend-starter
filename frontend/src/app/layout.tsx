import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages } from 'next-intl/server';
import ChatDockHost from '@/components/chat/ChatDockHost'
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LocaleProvider } from "@/providers/LocaleProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fbase - Modern Full-Stack Application",
  description: "A modern full-stack application built with Next.js, shadcn/ui, and Spring Boot.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Handle static export - use default messages if getMessages fails
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.warn('Failed to get messages during static export, using defaults');
    // Load default English messages for static export
    try {
      messages = (await import('../../messages/en.json')).default;
    } catch (importError) {
      console.warn('Failed to load default messages, using empty object');
      messages = {};
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LocaleProvider initialMessages={messages}>
          <ErrorBoundary>
            <QueryProvider>
              {children}
              { /* Floating chat dock - client-only */}
              <ChatDockHost />
            </QueryProvider>
          </ErrorBoundary>
        </LocaleProvider>
      </body>
    </html>
  );
}
