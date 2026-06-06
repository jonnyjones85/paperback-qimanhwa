// JSON shapes for the Vortexscans API (api.vortexscans.org).
// Field names verified against keiyoushi's arvenscans/VortexScans.kt + live responses.
// Browse/search => /api/query ; details+chapters => /api/post?postId= ; pages => /api/chapter?chapterId=

export interface VxGenre {
  name: string
}

export interface VxPostSummary {
  id: number
  slug: string
  postTitle: string
  featuredImage?: string
  seriesType?: string       // MANGA | MANHUA | MANHWA
  seriesStatus?: string     // ONGOING | COMPLETED | CANCELLED | DROPPED | COMING_SOON | MASS_RELEASED
  genres?: VxGenre[]
}

export interface VxQueryResponse {
  posts: VxPostSummary[]
  totalCount: number
}

export interface VxChapter {
  id: number
  slug: string
  number?: number | string   // usually a number, occasionally a string
  title?: string
  createdAt: string          // yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
  isLocked?: boolean
  isAccessible?: boolean
}

export interface VxPost {
  id: number
  slug: string
  postTitle: string
  postContent?: string       // HTML -> strip tags
  alternativeTitles?: string
  author?: string
  artist?: string
  featuredImage?: string
  seriesType?: string
  seriesStatus?: string
  genres?: VxGenre[]
  chapters?: VxChapter[]
}

export interface VxPostResponse {
  post: VxPost
}

export interface VxImage {
  url: string                // full absolute image URL (storage.vortexscans.org / wsrv.nl)
  order?: number
}

export interface VxChapterData {
  isLocked?: boolean
  isAccessible?: boolean
  images?: VxImage[]
}

export interface VxChapterResponse {
  chapter: VxChapterData
}
