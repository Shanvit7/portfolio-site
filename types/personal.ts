export type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
  description: string
  what_i_did: string[]
}

export type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
  date?: string
}

export type ActiveWork = {
  id: string
  name: string
  description: string
  type?: 'OSS' | 'Work'
  link: string
  links?: { label: string; url: string }[]
}

export type SocialLink = {
  label: string
  link: string
}
