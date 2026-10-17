import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'

const sitemap = (): MetadataRoute.Sitemap => [{ url: `${WEBSITE_URL}/` }]

export default sitemap
