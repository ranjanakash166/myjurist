import './globals.css'
import React, { ReactNode } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthProvider } from '../components/AuthProvider';
import { Toaster } from '../components/ui/toaster';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myjurist.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'My Jurist - AI-Powered Legal Intelligence Platform for Indian Litigation',
    template: '%s | My Jurist'
  },
  description: 'The first AI partner built for Indian Litigation. Transform your legal practice with AI-powered research, document analysis, regulatory compliance, and smart document drafting. Enterprise-grade security with domain-specific AI models.',
  keywords: [
    'legal AI',
    'Indian litigation',
    'legal research AI',
    'document analysis',
    'regulatory compliance',
    'legal technology',
    'AI law firm',
    'case law search',
    'legal document drafting',
    'Indian legal tech',
    'law firm software',
    'legal intelligence platform',
    'AI legal assistant',
    'legal due diligence',
    'patent intelligence'
  ],
  authors: [{ name: 'My Jurist' }],
  creator: 'My Jurist',
  publisher: 'My Jurist',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'My Jurist',
    title: 'My Jurist - AI-Powered Legal Intelligence Platform for Indian Litigation',
    description: 'Transform your legal practice with AI-powered research, document analysis, regulatory compliance, and smart document drafting. Built specifically for Indian litigation.',
    images: [
      {
        url: '/images/myjurist-logo.png',
        width: 1200,
        height: 630,
        alt: 'My Jurist - AI Legal Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Jurist - AI-Powered Legal Intelligence Platform',
    description: 'Transform your legal practice with AI-powered research, document analysis, and regulatory compliance. Built for Indian litigation.',
    images: ['/images/myjurist-logo.png'],
    creator: '@myjurist',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'Legal Technology',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
