// VortexScans — Paperback 0.8 source for vortexscans.org (custom id-based JSON API).
// All data is JSON from api.vortexscans.org — no HTML scraping:
//   browse/search => /api/query  ·  details+chapters => /api/post?postId=  ·  pages => /api/chapter?chapterId=
// Free browse/search/read need no login. Paid chapters: the better-auth session
// cookie is attached by VortexScansInterceptor (a token is baked in; paste a fresh
// one in Settings if it expires).
import {
  SourceInfo, ContentRating, SourceIntents,
  PaperbackExtensionBase,
  Chapter, ChapterDetails, SourceManga, PartialSourceManga,
  PagedResults, SearchRequest, HomeSection, HomeSectionType,
  Request, RequestManager,
  SourceStateManager, DUISection
} from '@paperback/types'

import { VxQueryResponse, VxPostResponse, VxChapterResponse } from './VortexScansDto'
import { VortexScansInterceptor } from './VortexScansInterceptor'
import { getSourceMenu, STATE } from './VortexScansSettings'
import {
  parseSeriesDetails, parseSeriesList, parseChapterList, parsePageList,
  mangaIdToPostId, mangaIdToSlug
} from './VortexScansParser'

const BASE = 'https://vortexscans.org'
const API  = 'https://api.vortexscans.org'
const PER_PAGE = 18

export const VortexScansInfo: SourceInfo = {
  version: '1.0.1',
  name: 'Vortex Scans',
  icon: 'icon.png',
  author: 'Kele',
  authorWebsite: '',
  description: 'Vortex Scans. Personal build — session-cookie login (auto-rotating) so owned/paid chapters open.',
  contentRating: ContentRating.MATURE,
  websiteBaseURL: BASE,
  intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class VortexScans implements PaperbackExtensionBase {
  stateManager: SourceStateManager = App.createSourceStateManager()

  private interceptor = new VortexScansInterceptor(this.stateManager)

  requestManager: RequestManager = App.createRequestManager({
    requestsPerSecond: 3,
    requestTimeout: 20000,
    interceptor: this.interceptor
  })

  private async getJSON<T>(url: string): Promise<T> {
    const req = App.createRequest({ url, method: 'GET' })
    const res = await this.requestManager.schedule(req, 2)
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`HTTP ${res.status} for ${url} (Cloudflare or expired session?)`)
    }
    return JSON.parse(res.data ?? '{}') as T
  }

  private queryUrl(page: number, search: string, orderBy?: string): string {
    const parts = [
      `page=${page}`,
      `perPage=${PER_PAGE}`,
      `searchTerm=${encodeURIComponent(search)}`
    ]
    if (orderBy) { parts.push(`orderBy=${orderBy}`, `orderDirection=desc`) }
    return `${API}/api/query?${parts.join('&')}`
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    const id = mangaIdToPostId(mangaId)
    const data = await this.getJSON<VxPostResponse>(`${API}/api/post?postId=${id}`)
    return parseSeriesDetails(mangaId, data.post)
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const showLocked = (await this.stateManager.retrieve(STATE.SHOW_LOCKED)) as boolean ?? false
    const id = mangaIdToPostId(mangaId)
    const data = await this.getJSON<VxPostResponse>(`${API}/api/post?postId=${id}`)
    return parseChapterList(data.post.chapters ?? [], showLocked)
  }

  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const data = await this.getJSON<VxChapterResponse>(`${API}/api/chapter?chapterId=${chapterId}`)
    const ch = data.chapter
    const imgs = ch?.images ?? []
    if (!imgs.length || ch?.isAccessible === false || ch?.isLocked === true) {
      const dq = (await this.stateManager.retrieve(STATE.DEBUG_REQ)) as string ?? '?'
      throw new Error(`Locked / no images — buy this chapter or check login. [auth:${dq} locked:${ch?.isLocked} acc:${ch?.isAccessible}]`)
    }
    return parsePageList(mangaId, chapterId, ch)
  }

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const data = await this.getJSON<VxQueryResponse>(this.queryUrl(page, query.title ?? ''))
    const items: PartialSourceManga[] = parseSeriesList(data.posts ?? [])
    const next = data.totalCount > page * PER_PAGE ? { page: page + 1 } : undefined
    return App.createPagedResults({ results: items, metadata: next })
  }

  async getHomePageSections(sectionCallback: (s: HomeSection) => void): Promise<void> {
    const sections = [
      { id: 'popular', title: 'Popular',        orderBy: 'totalViews' },
      { id: 'latest',  title: 'Latest Updates', orderBy: 'lastChapterAddedAt' }
    ]
    for (const s of sections) {
      const sec = App.createHomeSection({ id: s.id, title: s.title, type: HomeSectionType.singleRowNormal, containsMoreItems: true })
      sectionCallback(sec)
      const data = await this.getJSON<VxQueryResponse>(this.queryUrl(1, '', s.orderBy))
      sec.items = parseSeriesList(data.posts ?? [])
      sectionCallback(sec)
    }
  }

  async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
    const page: number = metadata?.page ?? 1
    const orderBy = homepageSectionId === 'latest' ? 'lastChapterAddedAt' : 'totalViews'
    const data = await this.getJSON<VxQueryResponse>(this.queryUrl(page, '', orderBy))
    const next = data.totalCount > page * PER_PAGE ? { page: page + 1 } : undefined
    return App.createPagedResults({ results: parseSeriesList(data.posts ?? []), metadata: next })
  }

  getMangaShareUrl(mangaId: string): string { return `${BASE}/series/${mangaIdToSlug(mangaId)}` }

  async getCloudflareBypassRequestAsync(): Promise<Request> {
    // Content lives on api.vortexscans.org, so solve Cloudflare for that host.
    return App.createRequest({ url: `${API}/api/query?page=1&perPage=1&searchTerm=`, method: 'GET' })
  }

  async getSourceMenu(): Promise<DUISection> { return getSourceMenu(this.stateManager) }
}
