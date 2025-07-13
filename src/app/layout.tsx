import './globals.css'
import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';

export const metadata = {
  title: 'My Jurist - Next Gen AI Law Firm',
  description: 'The first locally hosted AI built exclusively for legal due diligence—delivering unmatched efficiency, uncompromised data privacy, and unprecedented access to global patent intelligence.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
} 