(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./CloudflareBypassRequestProviding"), exports);
__exportStar(require("./HomePageSectionsProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./RequestManagerProviding"), exports);
__exportStar(require("./SearchResultsProviding"), exports);

},{"./ChapterProviding":8,"./CloudflareBypassRequestProviding":9,"./HomePageSectionsProviding":10,"./MangaProgressProviding":11,"./MangaProviding":12,"./RequestManagerProviding":13,"./SearchResultsProviding":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":17,"./DynamicUI/Exports/DUIForm":18,"./DynamicUI/Exports/DUIFormRow":19,"./DynamicUI/Exports/DUISection":20,"./DynamicUI/Rows/Exports/DUIButton":21,"./DynamicUI/Rows/Exports/DUIHeader":22,"./DynamicUI/Rows/Exports/DUIInputField":23,"./DynamicUI/Rows/Exports/DUILabel":24,"./DynamicUI/Rows/Exports/DUILink":25,"./DynamicUI/Rows/Exports/DUIMultilineLabel":26,"./DynamicUI/Rows/Exports/DUINavigationButton":27,"./DynamicUI/Rows/Exports/DUIOAuthButton":28,"./DynamicUI/Rows/Exports/DUISecureInputField":29,"./DynamicUI/Rows/Exports/DUISelect":30,"./DynamicUI/Rows/Exports/DUIStepper":31,"./DynamicUI/Rows/Exports/DUISwitch":32,"./Exports/Chapter":33,"./Exports/ChapterDetails":34,"./Exports/Cookie":35,"./Exports/HomeSection":36,"./Exports/IconText":37,"./Exports/MangaInfo":38,"./Exports/MangaProgress":39,"./Exports/MangaUpdates":40,"./Exports/PBCanvas":41,"./Exports/PBImage":42,"./Exports/PagedResults":43,"./Exports/PartialSourceManga":44,"./Exports/RawData":45,"./Exports/Request":46,"./Exports/RequestManager":47,"./Exports/Response":48,"./Exports/SearchField":49,"./Exports/SearchRequest":50,"./Exports/SecureStateManager":51,"./Exports/SourceCookieStore":52,"./Exports/SourceInterceptor":53,"./Exports/SourceManga":54,"./Exports/SourceStateManager":55,"./Exports/Tag":56,"./Exports/TagSection":57,"./Exports/TrackedMangaChapterReadAction":58,"./Exports/TrackerActionQueue":59}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":16,"./generated/_exports":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VortexScans = exports.VortexScansInfo = void 0;
// VortexScans — Paperback 0.8 source for vortexscans.org (custom id-based JSON API).
// All data is JSON from api.vortexscans.org — no HTML scraping:
//   browse/search => /api/query  ·  details+chapters => /api/post?postId=  ·  pages => /api/chapter?chapterId=
// Free browse/search/read need no login. Paid chapters: the better-auth session
// cookie is attached by VortexScansInterceptor (a token is baked in; paste a fresh
// one in Settings if it expires).
const types_1 = require("@paperback/types");
const VortexScansInterceptor_1 = require("./VortexScansInterceptor");
const VortexScansSettings_1 = require("./VortexScansSettings");
const VortexScansParser_1 = require("./VortexScansParser");
const BASE = 'https://vortexscans.org';
const API = 'https://api.vortexscans.org';
const PER_PAGE = 18;
exports.VortexScansInfo = {
    version: '1.0.0',
    name: 'Vortex Scans',
    icon: 'icon.png',
    author: 'Kele',
    authorWebsite: '',
    description: 'Vortex Scans. Personal build — session-cookie login (auto-rotating) so owned/paid chapters open.',
    contentRating: types_1.ContentRating.MATURE,
    websiteBaseURL: BASE,
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.SETTINGS_UI | types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
};
class VortexScans {
    constructor() {
        this.stateManager = App.createSourceStateManager();
        this.interceptor = new VortexScansInterceptor_1.VortexScansInterceptor(this.stateManager);
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 20000,
            interceptor: this.interceptor
        });
    }
    async getJSON(url) {
        const req = App.createRequest({ url, method: 'GET' });
        const res = await this.requestManager.schedule(req, 2);
        if (res.status < 200 || res.status >= 300) {
            throw new Error(`HTTP ${res.status} for ${url} (Cloudflare or expired session?)`);
        }
        return JSON.parse(res.data ?? '{}');
    }
    queryUrl(page, search, orderBy) {
        const parts = [
            `page=${page}`,
            `perPage=${PER_PAGE}`,
            `searchTerm=${encodeURIComponent(search)}`
        ];
        if (orderBy) {
            parts.push(`orderBy=${orderBy}`, `orderDirection=desc`);
        }
        return `${API}/api/query?${parts.join('&')}`;
    }
    async getMangaDetails(mangaId) {
        const id = (0, VortexScansParser_1.mangaIdToPostId)(mangaId);
        const data = await this.getJSON(`${API}/api/post?postId=${id}`);
        return (0, VortexScansParser_1.parseSeriesDetails)(mangaId, data.post);
    }
    async getChapters(mangaId) {
        const showLocked = (await this.stateManager.retrieve(VortexScansSettings_1.STATE.SHOW_LOCKED)) ?? false;
        const id = (0, VortexScansParser_1.mangaIdToPostId)(mangaId);
        const data = await this.getJSON(`${API}/api/post?postId=${id}`);
        return (0, VortexScansParser_1.parseChapterList)(data.post.chapters ?? [], showLocked);
    }
    async getChapterDetails(mangaId, chapterId) {
        const data = await this.getJSON(`${API}/api/chapter?chapterId=${chapterId}`);
        const ch = data.chapter;
        const imgs = ch?.images ?? [];
        if (!imgs.length || ch?.isAccessible === false || ch?.isLocked === true) {
            const dq = (await this.stateManager.retrieve(VortexScansSettings_1.STATE.DEBUG_REQ)) ?? '?';
            throw new Error(`Locked / no images — buy this chapter or check login. [auth:${dq} locked:${ch?.isLocked} acc:${ch?.isAccessible}]`);
        }
        return (0, VortexScansParser_1.parsePageList)(mangaId, chapterId, ch);
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const data = await this.getJSON(this.queryUrl(page, query.title ?? ''));
        const items = (0, VortexScansParser_1.parseSeriesList)(data.posts ?? []);
        const next = data.totalCount > page * PER_PAGE ? { page: page + 1 } : undefined;
        return App.createPagedResults({ results: items, metadata: next });
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'popular', title: 'Popular', orderBy: 'totalViews' },
            { id: 'latest', title: 'Latest Updates', orderBy: 'lastChapterAddedAt' }
        ];
        for (const s of sections) {
            const sec = App.createHomeSection({ id: s.id, title: s.title, type: types_1.HomeSectionType.singleRowNormal, containsMoreItems: true });
            sectionCallback(sec);
            const data = await this.getJSON(this.queryUrl(1, '', s.orderBy));
            sec.items = (0, VortexScansParser_1.parseSeriesList)(data.posts ?? []);
            sectionCallback(sec);
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const orderBy = homepageSectionId === 'latest' ? 'lastChapterAddedAt' : 'totalViews';
        const data = await this.getJSON(this.queryUrl(page, '', orderBy));
        const next = data.totalCount > page * PER_PAGE ? { page: page + 1 } : undefined;
        return App.createPagedResults({ results: (0, VortexScansParser_1.parseSeriesList)(data.posts ?? []), metadata: next });
    }
    getMangaShareUrl(mangaId) { return `${BASE}/series/${(0, VortexScansParser_1.mangaIdToSlug)(mangaId)}`; }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({ url: BASE, method: 'GET' });
    }
    async getSourceMenu() { return (0, VortexScansSettings_1.getSourceMenu)(this.stateManager); }
}
exports.VortexScans = VortexScans;

},{"./VortexScansInterceptor":63,"./VortexScansParser":64,"./VortexScansSettings":65,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VortexScansInterceptor = void 0;
const VortexScansSettings_1 = require("./VortexScansSettings");
const BASE = 'https://vortexscans.org';
const COOKIE_NAME = '__Secure-vthemeauth.session_token';
const COOKIE_DOMAIN = 'vortexscans.org';
// Baked-in session token (personal build) so it works with no typing. Overridable
// in Settings. NOTE: this is public in the served bundle and expires if unused for
// ~7 days; paste a fresh one in Settings if browsing stops returning your account.
const SEED_TOKEN = 'XcIMDAd63zkMkm6M7P47z3EVsDs8pz87.jzjyzKOFqVTzGP7LNqSuwTtSZ6F2J5QHi/1PYeWakbA=';
class VortexScansInterceptor {
    constructor(sm) {
        this.sm = sm;
    }
    async token() {
        const t = (await this.sm.keychain.retrieve(VortexScansSettings_1.STATE.SESSION));
        return (t && t.length) ? t : SEED_TOKEN;
    }
    async interceptRequest(request) {
        request.headers = {
            ...(request.headers ?? {}),
            'Accept': 'application/json, text/plain, */*',
            'Referer': `${BASE}/`,
            'Origin': BASE
        };
        if (request.url.includes('api.vortexscans.org')) {
            try {
                const tok = await this.token();
                if (tok) {
                    request.cookies = [
                        ...(request.cookies ?? []),
                        App.createCookie({ name: COOKIE_NAME, value: tok, domain: COOKIE_DOMAIN, path: '/' })
                    ];
                    await this.sm.store(VortexScansSettings_1.STATE.DEBUG_REQ, 'cookieAttached');
                }
                else {
                    await this.sm.store(VortexScansSettings_1.STATE.DEBUG_REQ, 'noToken');
                }
            }
            catch (e) {
                await this.sm.store(VortexScansSettings_1.STATE.DEBUG_REQ, 'reqEXC=' + String(e).slice(0, 60));
            }
        }
        return request;
    }
    async interceptResponse(response) {
        try {
            const h = response.headers ?? {};
            let raw;
            for (const k of Object.keys(h)) {
                if (k.toLowerCase() === 'set-cookie') {
                    const v = h[k];
                    raw = Array.isArray(v) ? v.join('\n') : String(v);
                    break;
                }
            }
            if (raw && raw.includes(COOKIE_NAME)) {
                const m = raw.match(new RegExp(`${COOKIE_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;\\n]+)`));
                if (m && m[1]) {
                    let val = m[1].trim();
                    try {
                        val = decodeURIComponent(val);
                    }
                    catch { /* keep as-is */ }
                    if (val && val !== 'deleted' && val.length > 10) {
                        await this.sm.keychain.store(VortexScansSettings_1.STATE.SESSION, val);
                        await this.sm.store(VortexScansSettings_1.STATE.DEBUG_RESP, 'rotated');
                    }
                }
            }
        }
        catch (e) {
            await this.sm.store(VortexScansSettings_1.STATE.DEBUG_RESP, 'respEXC=' + String(e).slice(0, 60));
        }
        return response;
    }
}
exports.VortexScansInterceptor = VortexScansInterceptor;

},{"./VortexScansSettings":65}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePageList = exports.parseChapterList = exports.parseSeriesDetails = exports.parseSeriesList = exports.mangaIdToSlug = exports.mangaIdToPostId = exports.encodeMangaId = void 0;
const stripHtml = (s) => (s ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .trim();
const encodeMangaId = (slug, id) => `${slug}#${id}`;
exports.encodeMangaId = encodeMangaId;
const mangaIdToPostId = (mangaId) => mangaId.includes('#') ? mangaId.split('#').pop() ?? mangaId : mangaId;
exports.mangaIdToPostId = mangaIdToPostId;
const mangaIdToSlug = (mangaId) => mangaId.split('#')[0] ?? mangaId;
exports.mangaIdToSlug = mangaIdToSlug;
function mapStatus(s) {
    switch ((s ?? '').toUpperCase()) {
        case 'ONGOING':
        case 'COMING_SOON':
        case 'MASS_RELEASED': return 'Ongoing';
        case 'COMPLETED': return 'Completed';
        case 'CANCELLED':
        case 'DROPPED': return 'Cancelled';
        case 'HIATUS': return 'Hiatus';
        default: return 'Unknown';
    }
}
function typeLabel(t) {
    switch ((t ?? '').toUpperCase()) {
        case 'MANGA': return 'Manga';
        case 'MANHUA': return 'Manhua';
        case 'MANHWA': return 'Manhwa';
        default: return undefined;
    }
}
function parseSeriesList(list) {
    return (list ?? [])
        .filter(s => (s.postTitle ?? '').trim().length > 0)
        .map(s => App.createPartialSourceManga({
        mangaId: (0, exports.encodeMangaId)(s.slug, s.id),
        title: s.postTitle.trim(),
        image: s.featuredImage ?? '',
        subtitle: undefined
    }));
}
exports.parseSeriesList = parseSeriesList;
function parseSeriesDetails(mangaId, p) {
    const desc = stripHtml(p.postContent);
    const alts = (p.alternativeTitles ?? '')
        .split(/\r?\n/).map(t => t.trim()).filter(t => t.length);
    const altBlock = alts.length ? `\n\nAlt: ${alts.join(', ')}` : '';
    const tags = (p.genres ?? []).map(g => App.createTag({ id: g.name, label: g.name }));
    const tl = typeLabel(p.seriesType);
    if (tl)
        tags.unshift(App.createTag({ id: `type:${tl}`, label: tl }));
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
    });
}
exports.parseSeriesDetails = parseSeriesDetails;
const isLockedChapter = (c) => c.isAccessible === false || c.isLocked === true;
function parseChapterList(chapters, showLocked) {
    return (chapters ?? [])
        .filter(c => showLocked || !isLockedChapter(c))
        .map(c => {
        const numText = (c.number !== undefined && c.number !== null) ? String(c.number).trim() : '';
        const fallback = (c.slug.split('chapter-')[1] ?? '').trim();
        const numStr = numText.length ? numText : fallback;
        const num = parseFloat(numStr);
        const title = (c.title ?? '').trim();
        const locked = isLockedChapter(c);
        const namePieces = ['Chapter', numStr].filter(Boolean).join(' ');
        return App.createChapter({
            id: String(c.id),
            chapNum: isNaN(num) ? 0 : num,
            name: (locked ? '🔒 ' : '') + (title.length ? `${namePieces} - ${title}` : namePieces),
            langCode: 'en',
            time: c.createdAt ? new Date(c.createdAt) : new Date()
        });
    });
}
exports.parseChapterList = parseChapterList;
function parsePageList(mangaId, chapterId, data) {
    const imgs = (data.images ?? []).slice().sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
    return App.createChapterDetails({
        id: chapterId,
        mangaId,
        pages: imgs.map(i => i.url)
    });
}
exports.parsePageList = parsePageList;

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceMenu = exports.STATE = void 0;
exports.STATE = {
    SESSION: 'session_token',
    SHOW_LOCKED: 'show_locked',
    DEBUG_REQ: 'debug_req',
    DEBUG_RESP: 'debug_resp' // plain — diagnostics
};
async function getSourceMenu(sm) {
    return App.createDUISection({
        id: 'vortexscans-settings',
        header: 'Vortex Scans Login',
        isHidden: false,
        rows: async () => [
            App.createDUISecureInputField({
                id: exports.STATE.SESSION,
                label: 'Session token',
                value: App.createDUIBinding({
                    get: async () => (await sm.keychain.retrieve(exports.STATE.SESSION)) ?? '',
                    set: async (v) => { await sm.keychain.store(exports.STATE.SESSION, (v ?? '').trim()); }
                })
            }),
            App.createDUISwitch({
                id: exports.STATE.SHOW_LOCKED,
                label: 'Show locked (paid) chapters',
                value: App.createDUIBinding({
                    get: async () => (await sm.retrieve(exports.STATE.SHOW_LOCKED)) ?? false,
                    set: async (v) => { await sm.store(exports.STATE.SHOW_LOCKED, v); }
                })
            }),
            App.createDUIButton({
                id: 'clear_session',
                label: 'Clear session token',
                onTap: async () => { await sm.keychain.store(exports.STATE.SESSION, undefined); }
            })
        ]
    });
}
exports.getSourceMenu = getSourceMenu;

},{}]},{},[62])(62)
});
