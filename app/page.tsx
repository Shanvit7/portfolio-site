import type { Metadata } from 'next'
import PaperIntro from '@/components/portfolio-page'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: 'Shanvit S Shetty | Software Engineer',
  description:
    'Frontend engineer. Built for 70K+ weekly users, cut property-listing load time from ~10s to under 1s, and helped grow organic traffic 65% in three months. Building Tabot alongside my day job.',
  ...(siteUrl
    ? {
        alternates: { canonical: '/' },
        openGraph: {
          type: 'website',
          url: '/',
          title: 'Shanvit S Shetty | Software Engineer',
          description:
            'Frontend engineer building products used by 70K+ people each week. Currently building Tabot alongside my day job.',
        },
      }
    : {}),
  twitter: {
    card: 'summary',
    title: 'Shanvit S Shetty | Software Engineer',
    description:
      'Frontend engineer building products used by 70K+ people each week. Currently building Tabot alongside my day job.',
  },
}

const HomePage = () => {
  return <PaperIntro />
}

export default HomePage
