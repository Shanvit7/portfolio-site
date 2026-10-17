import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
const metadataBase = (() => {
  try {
    return siteUrl ? new URL(siteUrl) : undefined
  } catch {
    return undefined
  }
})()

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: {
    default: 'Shanvit S Shetty | Software Engineer',
    template: '%s | Shanvit S Shetty',
  },
  description:
    'Software engineer building web products and exploring machine learning, LLMs, and agentic systems.',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body className="bg-white antialiased">{children}</body>
  </html>
)

export default RootLayout
