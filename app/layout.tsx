import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import {
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
  WEBSITE_URL,
} from '@/lib/constants'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

const metadataBase = (() => {
  try {
    return new URL(WEBSITE_URL)
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
    <head>
      {UMAMI_WEBSITE_ID && (
        <Script
          defer
          src={UMAMI_SCRIPT_URL}
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={new URL(WEBSITE_URL).hostname}
        />
      )}
    </head>
    <body className="bg-white antialiased">{children}</body>
  </html>
)

export default RootLayout
