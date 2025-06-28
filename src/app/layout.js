import './globals.css'

export const metadata = {
  title: 'My Jurist - Precision Legal AI: Local Data Privacy',
  description: 'The first locally-hosted AI designed exclusively for legal due diligence. Gain efficiency, maintain absolute data privacy, and harness unparalleled global patent insights.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 