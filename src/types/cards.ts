export interface CardLink {
  name: string
  url: string
}

export interface Card {
  uuid: string
  name?: string
  job_title?: string
  company?: string
  email?: string
  links: CardLink[]
  phone_fmt?: string
  phone_raw?: string
  location?: string
  website?: string
  bio?: string
  picture?: string | null
  slug?: string
  public?: boolean
}
