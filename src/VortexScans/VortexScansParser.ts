// JSON -> Paperback objects for Vortexscans.
// mangaId is encoded as "<slug>#<postId>" so we keep both the numeric id (for the
// id-based API) and the slug (for the website share URL). chapterId is the numeric
// chapter id as a string (the pages endpoint only needs chapterId).
import { Chapter, ChapterDetails, SourceManga, PartialSourceManga } from '@paperback/types'
import { VxPostSummary, VxPost, VxChapter, VxChapterData } from './VortexScansDto'

const stripHtml = (s?: string) =>
  (s ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .trim()

export const encodeMangaId = (slug: string, id: number | string) => `${slug}#${id}`
export const mangaIdToPostId = (mangaId: string) => mangaId.includes('#') ? mangaId.split('#').pop() ?? mangaId : mangaId
export const mangaIdToSlug   = (mangaId: string) => mangaId.split('#')[0] ?? mangaId

function mapStatus(s?: string): string {
  switch ((s ?? '').toUpperCase()) {
    case 'ONGOING': case 'COMING_SOON': case 'MASS_RELEASED': return 'Ongoing'
    case 'COMPLETED': return 'Completed'
    case 'CANCELLED': case 'DROPPED': return 'Cancelled'
    case 'HIATUS': return 'Hiatus'
    default: return 'Unknown'
  }
}

function typeLabel(t?: string): string | undefined {
  switch ((t ?? '').toUpperCase()) {
    case 'MANGA': return 'Manga'
    case 'MANHUA': return 'Manhua'
    case 'MANHWA': return 'Manhwa'
    default: return undefined
  }
}

export function parseSeriesList(list: VxPostSummary[]): PartialSourceManga[] {
  return (list ?? [])
    .filter(s => (s.postTitle ?? '').trim().length > 0)
    .map(s => App.createPartialSourceManga({
      mangaId: encodeMangaId(s.slug, s.id),
      title: s.postTitle.trim(),
      image: s.featuredImage ?? '',
      subtitle: undefined
    }))
}

export function parseSeriesDetails(mangaId: string, p: VxPost): SourceManga {
  const desc = stripHtml(p.postContent)
  const alts = (p.alternativeTitles ?? '')
    .split(/\r?\n/).map(t => t.trim()).filter(t => t.length)
  const altBlock = alts.length ? `\n\nAlt: ${alts.join(', ')}` : ''

  const tags = (p.genres ?? []).map(g => App.createTag({ id: g.name, label: g.name }))
  const tl = typeLabel(p.seriesType)
  if (tl) tags.unshift(App.createTag({ id: `type:${tl}`, label: tl }))

  return App.createSourceManga({
    id: mangaId,
    mangaInfo: App.createMangaInfo({
      titles: [p.postTitle.trim()],
      image: p.featuredImage ?? '',
      author: (p.author ?? '').trim(),
      artist: (p.artist ?? '').trim(),
      desc: desc + altBlock,
      status: mapStatus(p.seriesStatus),
      tags: [App.createTagSection({ id: 'genres', label: 'Genres', tags })]
    })
  })
}

const isLockedChapter = (c: { isAccessible?: boolean; isLocked?: boolean }) =>
  c.isAccessible === false || c.isLocked === true

export function parseChapterList(chapters: VxChapter[], showLocked: boolean): Chapter[] {
  return (chapters ?? [])
    .filter(c => showLocked || !isLockedChapter(c))
    .map(c => {
      const numText = (c.number !== undefined && c.number !== null) ? String(c.number).trim() : ''
      const fallback = (c.slug.split('chapter-')[1] ?? '').trim()
      const numStr = numText.length ? numText : fallback
      const num = parseFloat(numStr)
      const title = (c.title ?? '').trim()
      const locked = isLockedChapter(c)
      const namePieces = ['Chapter', numStr].filter(Boolean).join(' ')
      return App.createChapter({
        id: String(c.id),
        chapNum: isNaN(num) ? 0 : num,
        name: (locked ? '🔒 ' : '') + (title.length ? `${namePieces} - ${title}` : namePieces),
        langCode: 'en',
        time: c.createdAt ? new Date(c.createdAt) : new Date()
      })
    })
}

export function parsePageList(mangaId: string, chapterId: string, data: VxChapterData): ChapterDetails {
  const imgs = (data.images ?? []).slice().sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9))
  return App.createChapterDetails({
    id: chapterId,
    mangaId,
    pages: imgs.map(i => i.url)
  })
}
