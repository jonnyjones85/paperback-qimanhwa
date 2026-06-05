// QiManhwa — Paperback 0.8 source for qimanhwa.com (EZManhwa JSON-API platform).
// All data is JSON from api.qimanhwa.com/api/v1 — no HTML scraping.
// Free browse/search/series/free-chapters need no login. Premium (coin-locked)
// chapters: paste your refresh token once in Settings — the interceptor auto-mints
// and rotates the short-lived access token (see QiManhwaInterceptor.ts).

import {
  SourceInfo, ContentRating, SourceIntents,
  PaperbackExtensionBase,
  Chapter, ChapterDetails, SourceManga, PartialSourceManga,
  PagedResults, SearchRequest, HomeSection, HomeSectionType,
  Request, RequestManager,
  SourceStateManager, DUISection
} from '@paperback/types'

import { QiListWrapper, QiSeries, QiChapter, QiPageList } from './QiManhwaDto'
import { QiManhwaInterceptor } from './QiManhwaInterceptor'
import { getSourceMenu, STATE } from './QiManhwaSettings'
import {
  parseSeriesDetails, parseSeriesList, parseChapterList, parsePageList
} from './QiManhwaParser'

const BASE = 'https://qimanhwa.com'
const API  = 'https://api.qimanhwa.com/api/v1'

export const QiManhwaInfo: SourceInfo = {
  version: '1.2.0',
  name: 'QiManhwa',
  icon: 'icon.png',
  author: 'Kele',
  authorWebsite: '',
  description: 'QiManhwa (EZManhwa platform). Personal build — login token baked in and auto-refreshed; free + premium chapters open with no setup.',
  contentRating: ContentRating.MATURE,
  websiteBaseURL: BASE,
  intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class QiManhwa implements PaperbackExtensionBase {
  stateManager: SourceStateManager = App.createSourceStateManager()

  private interceptor = new QiManhwaInterceptor(this.stateManager)

  requestManager: RequestManager = App.createRequestManager({
    requestsPerSecond: 2,          // EZManhwa family rate-limits ~2 req/s
    requestTimeout: 20000,
    interceptor: this.interceptor
  })

  constructor() {
    // Separate manager for the token-refresh POST (shares the interceptor for
    // headers, but avoids re-entering the main queue from inside interceptRequest).
    this.interceptor.authManager = App.createRequestManager({
      requestsPerSecond: 2,
      requestTimeout: 20000,
      interceptor: this.interceptor
    })
  }

  private async getJSON<T>(url: string): Promise<T> {
    const req = App.createRequest({ url, method: 'GET' })
    const res = await this.requestManager.schedule(req, 2)
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`HTTP ${res.status} for ${url} (Cloudflare or expired session?)`)
    }
    return JSON.parse(res.data ?? '{}') as T
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    const data = await this.getJSON<QiSeries>(`${API}/series/${mangaId}`)
    return parseSeriesDetails(mangaId, data)
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const showLocked = (await this.stateManager.retrieve(STATE.SHOW_LOCKED)) as boolean ?? false
    const out: Chapter[] = []
    let page = 1, totalPages = 1
    do {
      const wrap = await this.getJSON<QiListWrapper<QiChapter>>(
        `${API}/series/${mangaId}/chapters?page=${page}&perPage=100&sort=desc`)
      out.push(...parseChapterList(mangaId, wrap.data, showLocked))
      totalPages = wrap.totalPages; page = wrap.current + 1
    } while (page <= totalPages)
    return out
  }

  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    // chapterId canonical form = "series/{seriesSlug}/chapters/{chapterSlug}"
    const data = await this.getJSON<QiPageList>(`${API}/${chapterId}`)
    if (data.requiresPurchase || !data.images || data.images.length === 0) {
      throw new Error(
        'This chapter is coin-locked and not unlocked on your account. Unlock it on qimanhwa.com, ' +
        'and make sure your Refresh Token is set in this source’s Settings.')
    }
    return parsePageList(mangaId, chapterId, data)
  }

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const q = encodeURIComponent(query.title ?? '')
    const wrap = await this.getJSON<QiListWrapper<QiSeries>>(
      `${API}/series/search?q=${q}&page=${page}&perPage=20`)
    const items: PartialSourceManga[] = parseSeriesList(wrap.data)
    const next = wrap.current < wrap.totalPages ? { page: page + 1 } : undefined
    return App.createPagedResults({ results: items, metadata: next })
  }

  async getHomePageSections(sectionCallback: (s: HomeSection) => void): Promise<void> {
    const sections = [
      { id: 'popular', title: 'Popular', sort: 'popular' },
      { id: 'latest',  title: 'Latest Updates', sort: 'latest' }
    ]
    for (const s of sections) {
      const sec = App.createHomeSection({ id: s.id, title: s.title, type: HomeSectionType.singleRowNormal, containsMoreItems: true })
      sectionCallback(sec)
      const wrap = await this.getJSON<QiListWrapper<QiSeries>>(
        `${API}/series?page=1&perPage=20&sort=${s.sort}`)
      sec.items = parseSeriesList(wrap.data)
      sectionCallback(sec)
    }
  }

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const sort = homepageSectionId === 'latest' ? 'latest' : 'popular'
    const wrap = await this.getJSON<QiListWrapper<QiSeries>>(
      `${API}/series?page=${page}&perPage=20&sort=${sort}`)
    const next = wrap.current < wrap.totalPages ? { page: page + 1 } : undefined
    return App.createPagedResults({ results: parseSeriesList(wrap.data), metadata: next })
  }

  getMangaShareUrl(mangaId: string): string { return `${BASE}/series/${mangaId}` }

  async getCloudflareBypassRequestAsync(): Promise<Request> {
    return App.createRequest({ url: BASE, method: 'GET' })
  }

  async getSourceMenu(): Promise<DUISection> { return getSourceMenu(this.stateManager) }
}
