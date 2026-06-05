// JSON -> Paperback objects.
import { Chapter, ChapterDetails, SourceManga, PartialSourceManga } from '@paperback/types'
import { QiSeries, QiChapter, QiPageList } from './QiManhwaDto'

const stripHtml = (s?: string) => (s ?? '').replace(/<[^>]*>/g, '').trim()

function mapStatus(s?: string): string {
  switch ((s ?? '').toUpperCase()) {
    case 'ONGOING': case 'MASS_RELEASED': return 'Ongoing'
    case 'COMPLETED': return 'Completed'
    case 'DROPPED': return 'Cancelled'
    case 'HIATUS': return 'Hiatus'
    default: return 'Unknown'
  }
}

export function parseSeriesList(list: QiSeries[]): PartialSourceManga[] {
  return list
    .filter(s => (s.type ?? '').toUpperCase() !== 'NOVEL')
    .map(s => App.createPartialSourceManga({
      mangaId: s.slug, title: s.title, image: s.cover ?? '', subtitle: undefined
    }))
}

export function parseSeriesDetails(slug: string, s: QiSeries): SourceManga {
  const desc = stripHtml(s.description)
  const alt = s.alternativeTitles ? `\n\nAlt: ${s.alternativeTitles}` : ''
  return App.createSourceManga({
    id: slug,
    mangaInfo: App.createMangaInfo({
      titles: [s.title],
      image: s.cover ?? '',
      author: s.author ?? '',
      artist: s.artist ?? '',
      desc: desc + alt,
      status: mapStatus(s.status),
      tags: [ App.createTagSection({ id: 'genres', label: 'Genres',
        tags: (s.genres ?? []).map(g => App.createTag({ id: g.name, label: g.name })) }) ]
    })
  })
}

export function parseChapterList(seriesSlug: string, list: QiChapter[], showLocked: boolean): Chapter[] {
  return list
    .filter(c => showLocked || !c.requiresPurchase)
    .map(c => App.createChapter({
      chapNum: c.number ?? 0,
      id: `series/${seriesSlug}/chapters/${c.slug}`,
      name: (c.requiresPurchase ? '🔒 ' : '') + (c.title ?? `Chapter ${c.number ?? ''}`),
      langCode: 'en',
      time: c.createdAt ? new Date(c.createdAt) : new Date()
    }))
}

export function parsePageList(mangaId: string, chapterId: string, p: QiPageList): ChapterDetails {
  return App.createChapterDetails({
    id: chapterId, mangaId,
    pages: (p.images ?? []).map(i => i.url)
  })
}

// getSearchTags/getSearchFields (genre/status/type filters on /series) are optional
// and left out of v1 — the /search endpoint ignores filters. Add later wired to
// GET /series?...&genre=&status=&type= for the browse-with-filters path.
