import Image, { type StaticImageData } from 'next/image'

export const CompanyWebsite = ({
  name,
  href,
  logo,
}: {
  name: string
  href: string
  logo: StaticImageData
}) => (
  <a
    className="mr-1 inline-flex align-middle items-center focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-4"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit ${name} website`}
  >
    <Image
      className="h-6.5 w-auto max-w-36 object-contain max-[700px]:h-6"
      src={logo}
      alt=""
      loading="lazy"
      unoptimized
    />
  </a>
)
