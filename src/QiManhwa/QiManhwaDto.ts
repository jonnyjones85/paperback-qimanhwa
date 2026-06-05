// JSON shapes for the EZManhwa/EZManga API used by qimanhwa.com.
// Field names verified against keiyoushi's EZManhwaDto.kt (Mihon/Tachiyomi reference).
// CDN/image host is NOT hardcoded — images[].url is a full absolute URL passed through unchanged.

export interface QiListWrapper<T> {
  data: T[]
  totalPages: number
  current: number
}

export interface QiGenre {
  name: string
}

export interface QiSeries {
  slug: string
  title: string
  cover?: string
  type?: string            // "NOVEL" entries are filtered out of manga results
  status?: string          // ONGOING | MASS_RELEASED | COMPLETED | DROPPED | HIATUS
  alternativeTitles?: string
  description?: string      // HTML -> strip tags
  author?: string
  artist?: string
  genres?: QiGenre[]
}

export interface QiChapter {
  slug: string
  number?: number           // double
  title?: string
  requiresPurchase?: boolean
  createdAt?: string        // yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
}

export interface QiPageList {
  images?: { url: string }[]   // each url = full absolute image URL
  requiresPurchase?: boolean
  totalImages?: number
}
