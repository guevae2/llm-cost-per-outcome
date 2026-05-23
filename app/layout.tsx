import './globals.css';
import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://llm-cost-per-outcome.vercel.app'),
  title: 'LLM Cost Calculator — Real Cost Per Outcome, Not Per Token',
  description: 'Compare the real outcome cost across 10 top LLMs (Opus, Sonnet, Haiku, GPT-4o, o3-mini, Gemini Pro, DeepSeek V3) factoring in retry rates and quality scores.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LLM Cost Calculator — Real Cost Per Outcome, Not Per Token',
    description: 'Compare the real outcome cost across 10 top LLMs (Opus, Sonnet, Haiku, GPT-4o, o3-mini, Gemini Pro, DeepSeek V3) factoring in retry rates and quality scores.',
    url: 'https://llm-cost-per-outcome.vercel.app',
    siteName: 'LLM Cost-Per-Outcome Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LLM Cost-Per-Outcome Calculator Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Cost Calculator — Real Cost Per Outcome, Not Per Token',
    description: 'Compare the real outcome cost across 10 top LLMs (Opus, Sonnet, Haiku, GPT-4o, o3-mini, Gemini Pro, DeepSeek V3) factoring in retry rates and quality scores.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
