import type { Metadata } from 'next'
import PaperIntro from '@/components/portfolio-page'
import { GITHUB_URL, LINKEDIN_URL, WEBSITE_URL } from '@/lib/constants'

const title = 'Shanvit S Shetty — Frontend Engineer & Product Builder'
const description =
  'Frontend engineer with 4+ years building web products. Improved property listings serving 10K+ daily visitors from ~10s to under 1s, and helped grow organic traffic 65% in three months. Building at Zosma AI.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${WEBSITE_URL}/#profile`,
      url: `${WEBSITE_URL}/`,
      name: title,
      mainEntity: { '@id': `${WEBSITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${WEBSITE_URL}/#person`,
      name: 'Shanvit S Shetty',
      url: `${WEBSITE_URL}/`,
      jobTitle: 'Frontend Engineer',
      description,
      sameAs: [GITHUB_URL, LINKEDIN_URL].filter(Boolean),
      worksFor: {
        '@type': 'Organization',
        '@id': `${WEBSITE_URL}/#zosma-ai`,
        name: 'Zosma AI',
        url: 'https://zosma.ai',
      },
    },
  ],
}

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: WEBSITE_URL },
  openGraph: {
    type: 'website',
    url: WEBSITE_URL,
    title,
    description,
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

const HomePage = () => (
  <>
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized and escapes script-closing markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
    <PaperIntro />
  </>
)

export default HomePage
