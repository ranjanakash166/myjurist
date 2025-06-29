import './globals.css'
import React, { ReactNode } from 'react'

export const metadata = {
  title: 'My Jurist - Next Gen AI Law Firm',
  description: 'The first locally hosted AI built exclusively for legal due diligence—delivering unmatched efficiency, uncompromised data privacy, and unprecedented access to global patent intelligence.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 