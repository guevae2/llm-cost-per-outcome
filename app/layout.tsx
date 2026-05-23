import './globals.css';
import React from 'react';

export const metadata = {
  title: 'LLM Cost Calculator — Real Cost Per Outcome, Not Per Token',
  description: 'Public free calculator comparing the real outcome cost across 10 top LLMs (Claude Opus, Sonnet, Gemini Pro, GPT-4o, DeepSeek) factoring retry rates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-darkBg text-slate-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}