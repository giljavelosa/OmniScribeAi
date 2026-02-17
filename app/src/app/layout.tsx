import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OmniScribe — Evidence-Based Clinical Documentation',
  description: 'AI-powered clinical documentation platform with evidence-based frameworks for medical, rehabilitation, and behavioral health providers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
