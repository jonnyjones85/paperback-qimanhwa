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
// QiManhwa — Paperback 0.8 source for qimanhwa.com (EZManhwa JSON-API platform).
// All data is JSON from api.qimanhwa.com/api/v1 — no HTML scraping.
// Free browse/search/series/free-chapters need no login. Premium (coin-locked)
// chapters: paste your refresh token once in Settings — the interceptor auto-mints
// and rotates the short-lived access token (see QiManhwaInterceptor.ts).
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiManhwa = exports.QiManhwaInfo = void 0;
const types_1 = require("@paperback/types");
const QiManhwaInterceptor_1 = require("./QiManhwaInterceptor");
const QiManhwaSettings_1 = require("./QiManhwaSettings");
const QiManhwaParser_1 = require("./QiManhwaParser");
const BASE = 'https://qimanhwa.com';
const API = 'https://api.qimanhwa.com/api/v1';
exports.QiManhwaInfo = {
    version: '1.5.0',
    name: 'QiManhwa',
    icon: 'icon.png',
    author: 'Kele',
    authorWebsite: '',
    description: 'QiManhwa (EZManhwa platform). Personal build — real account login (email+password) with auto-refresh; self-healing, owned premium chapters open.',
    contentRating: types_1.ContentRating.MATURE,
    websiteBaseURL: BASE,
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.SETTINGS_UI | types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
};
class QiManhwa {
    constructor() {
        this.stateManager = App.createSourceStateManager();
        this.interceptor = new QiManhwaInterceptor_1.QiManhwaInterceptor(this.stateManager);
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 2,
            requestTimeout: 20000,
            interceptor: this.interceptor
        });
        // Separate manager for the token-refresh POST (shares the interceptor for
        // headers, but avoids re-entering the main queue from inside interceptRequest).
        this.interceptor.authManager = App.createRequestManager({
            requestsPerSecond: 2,
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
    async getMangaDetails(mangaId) {
        const data = await this.getJSON(`${API}/series/${mangaId}`);
        return (0, QiManhwaParser_1.parseSeriesDetails)(mangaId, data);
    }
    async getChapters(mangaId) {
        const showLocked = (await this.stateManager.retrieve(QiManhwaSettings_1.STATE.SHOW_LOCKED)) ?? false;
        const out = [];
        let page = 1, totalPages = 1;
        do {
            const wrap = await this.getJSON(`${API}/series/${mangaId}/chapters?page=${page}&perPage=100&sort=desc`);
            out.push(...(0, QiManhwaParser_1.parseChapterList)(mangaId, wrap.data, showLocked));
            totalPages = wrap.totalPages;
            page = wrap.current + 1;
        } while (page <= totalPages);
        return out;
    }
    async getChapterDetails(mangaId, chapterId) {
        // chapterId canonical form = "series/{seriesSlug}/chapters/{chapterSlug}"
        const data = await this.getJSON(`${API}/${chapterId}`);
        // Serve whenever images are present — an OWNED premium chapter returns
        // requiresPurchase:true with images, so only bail when there are no images.
        if (!data.images || data.images.length === 0) {
            const dq = (await this.stateManager.retrieve(QiManhwaSettings_1.STATE.DEBUG_REQ)) ?? '?';
            const df = (await this.stateManager.retrieve(QiManhwaSettings_1.STATE.DEBUG_RF)) ?? '?';
            throw new Error(`Locked / no images. [diag req:${dq} | rf:${df} | reqPurchase:${data.requiresPurchase}]`);
        }
        return (0, QiManhwaParser_1.parsePageList)(mangaId, chapterId, data);
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const q = encodeURIComponent(query.title ?? '');
        const wrap = await this.getJSON(`${API}/series/search?q=${q}&page=${page}&perPage=20`);
        const items = (0, QiManhwaParser_1.parseSeriesList)(wrap.data);
        const next = wrap.current < wrap.totalPages ? { page: page + 1 } : undefined;
        return App.createPagedResults({ results: items, metadata: next });
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'popular', title: 'Popular', sort: 'popular' },
            { id: 'latest', title: 'Latest Updates', sort: 'latest' }
        ];
        for (const s of sections) {
            const sec = App.createHomeSection({ id: s.id, title: s.title, type: types_1.HomeSectionType.singleRowNormal, containsMoreItems: true });
            sectionCallback(sec);
            const wrap = await this.getJSON(`${API}/series?page=1&perPage=20&sort=${s.sort}`);
            sec.items = (0, QiManhwaParser_1.parseSeriesList)(wrap.data);
            sectionCallback(sec);
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const sort = homepageSectionId === 'latest' ? 'latest' : 'popular';
        const wrap = await this.getJSON(`${API}/series?page=${page}&perPage=20&sort=${sort}`);
        const next = wrap.current < wrap.totalPages ? { page: page + 1 } : undefined;
        return App.createPagedResults({ results: (0, QiManhwaParser_1.parseSeriesList)(wrap.data), metadata: next });
    }
    getMangaShareUrl(mangaId) { return `${BASE}/series/${mangaId}`; }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({ url: BASE, method: 'GET' });
    }
    async getSourceMenu() { return (0, QiManhwaSettings_1.getSourceMenu)(this.stateManager); }
}
exports.QiManhwa = QiManhwa;

},{"./QiManhwaInterceptor":63,"./QiManhwaParser":64,"./QiManhwaSettings":65,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiManhwaInterceptor = void 0;
const QiManhwaSettings_1 = require("./QiManhwaSettings");
const BASE = 'https://qimanhwa.com';
const API = 'https://api.qimanhwa.com/api/v1';
const ACCESS_TTL_MS = 14 * 60 * 1000;
// Baked-in account (personal build) so it works with no typing. Overridable in Settings.
const SEED_EMAIL = 'diabatekele@gmail.com';
const SEED_PASSWORD = 'runboc-zahhy1-gYztuk';
class QiManhwaInterceptor {
    constructor(sm) {
        this.sm = sm;
    }
    async creds() {
        const e = (await this.sm.retrieve(QiManhwaSettings_1.STATE.EMAIL));
        const p = (await this.sm.keychain.retrieve(QiManhwaSettings_1.STATE.PASSWORD));
        return {
            email: (e && e.length) ? e : SEED_EMAIL,
            password: (p && p.length) ? p : SEED_PASSWORD
        };
    }
    async currentRefresh() {
        return (await this.sm.keychain.retrieve(QiManhwaSettings_1.STATE.REFRESH)) ?? '';
    }
    async interceptRequest(request) {
        request.headers = {
            ...(request.headers ?? {}),
            'Accept': 'application/json, text/plain, */*',
            'Referer': `${BASE}/`,
            'Origin': BASE
        };
        // Login carries credentials in the body — no auth header, no auth recursion.
        if (request.url.includes('/auth/login'))
            return request;
        // Refresh carries the refresh token as a Bearer.
        if (request.url.includes('/auth/refresh')) {
            const rt = await this.currentRefresh();
            if (rt)
                request.headers['Authorization'] = `Bearer ${rt}`;
            return request;
        }
        // Every other API request: ensure a valid access token, attach as Bearer.
        if (request.url.includes('api.qimanhwa.com')) {
            let dbg = '';
            try {
                let at = (await this.sm.keychain.retrieve(QiManhwaSettings_1.STATE.ACCESS));
                const exp = (await this.sm.retrieve(QiManhwaSettings_1.STATE.ACCESS_EXP)) ?? 0;
                if (!at || Date.now() >= exp) {
                    dbg += 'needAuth;';
                    await this.ensureAuth();
                    at = (await this.sm.keychain.retrieve(QiManhwaSettings_1.STATE.ACCESS));
                }
                if (at) {
                    request.headers['Authorization'] = `Bearer ${at}`;
                    dbg += 'authSent=Y';
                }
                else {
                    dbg += 'authSent=N';
                }
            }
            catch (e) {
                dbg += 'reqEXC=' + String(e).slice(0, 60);
            }
            await this.sm.store(QiManhwaSettings_1.STATE.DEBUG_REQ, dbg);
        }
        return request;
    }
    async interceptResponse(response) {
        return response;
    }
    // Single-flight auth: refresh if we can, otherwise log in.
    ensureAuth() {
        if (!this.authing) {
            this.authing = this.doAuth().then(() => { this.authing = undefined; }, (e) => { this.authing = undefined; throw e; });
        }
        return this.authing;
    }
    async doAuth() {
        if (!this.authManager) {
            await this.sm.store(QiManhwaSettings_1.STATE.DEBUG_RF, 'NO_AUTHMGR');
            throw new Error('no authManager');
        }
        const rt = await this.currentRefresh();
        if (rt) {
            if (await this.tryRefresh())
                return; // fast path
        }
        await this.doLogin(); // primary / self-heal
    }
    async store(j, how) {
        if (j.accessToken)
            await this.sm.keychain.store(QiManhwaSettings_1.STATE.ACCESS, j.accessToken);
        if (j.refreshToken)
            await this.sm.keychain.store(QiManhwaSettings_1.STATE.REFRESH, j.refreshToken);
        await this.sm.store(QiManhwaSettings_1.STATE.ACCESS_EXP, Date.now() + ACCESS_TTL_MS);
        await this.sm.store(QiManhwaSettings_1.STATE.DEBUG_RF, `${how} gotAT=${j.accessToken ? 'Y' : 'N'}`);
    }
    async tryRefresh() {
        const req = App.createRequest({ url: `${API}/auth/refresh`, method: 'POST' });
        let res;
        try {
            res = await this.authManager.schedule(req, 1);
        }
        catch (e) {
            await this.sm.store(QiManhwaSettings_1.STATE.DEBUG_RF, 'refreshEXC=' + String(e).slice(0, 60));
            return false;
        }
        if (res.status >= 200 && res.status < 300) {
            await this.store(JSON.parse(res.data ?? '{}'), `refresh=${res.status}`);
            return true;
        }
        await this.sm.store(QiManhwaSettings_1.STATE.DEBUG_RF, `refresh=${res.status}`);
        return false;
    }
    async doLogin() {
        const { email, password } = await this.creds();
        const req = App.createRequest({
            url: `${API}/auth/login`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ email, password })
        });
        const res = await this.authManager.schedule(req, 1);
        if (res.status >= 200 && res.status < 300) {
            await this.store(JSON.parse(res.data ?? '{}'), `login=${res.status}`);
            return;
        }
        await this.sm.keychain.store(QiManhwaSettings_1.STATE.ACCESS, undefined);
        await this.sm.store(QiManhwaSettings_1.STATE.ACCESS_EXP, 0);
        await this.sm.store(QiManhwaSettings_1.STATE.DEBUG_RF, `login=${res.status}`);
        throw new Error(`login failed HTTP ${res.status} — check Email/Password in Settings`);
    }
}
exports.QiManhwaInterceptor = QiManhwaInterceptor;

},{"./QiManhwaSettings":65}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePageList = exports.parseChapterList = exports.parseSeriesDetails = exports.parseSeriesList = void 0;
const stripHtml = (s) => (s ?? '').replace(/<[^>]*>/g, '').trim();
function mapStatus(s) {
    switch ((s ?? '').toUpperCase()) {
        case 'ONGOING':
        case 'MASS_RELEASED': return 'Ongoing';
        case 'COMPLETED': return 'Completed';
        case 'DROPPED': return 'Cancelled';
        case 'HIATUS': return 'Hiatus';
        default: return 'Unknown';
    }
}
function parseSeriesList(list) {
    return list
        .filter(s => (s.type ?? '').toUpperCase() !== 'NOVEL')
        .map(s => App.createPartialSourceManga({
        mangaId: s.slug, title: s.title, image: s.cover ?? '', subtitle: undefined
    }));
}
exports.parseSeriesList = parseSeriesList;
function parseSeriesDetails(slug, s) {
    const desc = stripHtml(s.description);
    const alt = s.alternativeTitles ? `\n\nAlt: ${s.alternativeTitles}` : '';
    return App.createSourceManga({
        id: slug,
        mangaInfo: App.createMangaInfo({
            titles: [s.title],
            image: s.cover ?? '',
            author: s.author ?? '',
            artist: s.artist ?? '',
            desc: desc + alt,
            status: mapStatus(s.status),
            tags: [App.createTagSection({ id: 'genres', label: 'Genres',
                    tags: (s.genres ?? []).map(g => App.createTag({ id: g.name, label: g.name })) })]
        })
    });
}
exports.parseSeriesDetails = parseSeriesDetails;
function parseChapterList(seriesSlug, list, showLocked) {
    return list
        .filter(c => showLocked || !c.requiresPurchase)
        .map(c => App.createChapter({
        chapNum: c.number ?? 0,
        id: `series/${seriesSlug}/chapters/${c.slug}`,
        name: (c.requiresPurchase ? '🔒 ' : '') + (c.title ?? `Chapter ${c.number ?? ''}`),
        langCode: 'en',
        time: c.createdAt ? new Date(c.createdAt) : new Date()
    }));
}
exports.parseChapterList = parseChapterList;
function parsePageList(mangaId, chapterId, p) {
    return App.createChapterDetails({
        id: chapterId, mangaId,
        pages: (p.images ?? []).map(i => i.url)
    });
}
exports.parsePageList = parsePageList;
// getSearchTags/getSearchFields (genre/status/type filters on /series) are optional
// and left out of v1 — the /search endpoint ignores filters. Add later wired to
// GET /series?...&genre=&status=&type= for the browse-with-filters path.

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceMenu = exports.STATE = void 0;
exports.STATE = {
    EMAIL: 'email',
    PASSWORD: 'password',
    REFRESH: 'refresh_token',
    ACCESS: 'access_token',
    ACCESS_EXP: 'access_exp',
    SHOW_LOCKED: 'show_locked',
    DEBUG_REQ: 'debug_req',
    DEBUG_RF: 'debug_rf' // plain — diagnostics
};
async function clearTokens(sm) {
    await sm.keychain.store(exports.STATE.ACCESS, undefined);
    await sm.keychain.store(exports.STATE.REFRESH, undefined);
    await sm.store(exports.STATE.ACCESS_EXP, 0);
}
async function getSourceMenu(sm) {
    return App.createDUISection({
        id: 'qimanhwa-settings',
        header: 'QiManhwa Login',
        isHidden: false,
        rows: async () => [
            App.createDUIInputField({
                id: exports.STATE.EMAIL,
                label: 'Email',
                value: App.createDUIBinding({
                    get: async () => (await sm.retrieve(exports.STATE.EMAIL)) ?? '',
                    set: async (v) => { await sm.store(exports.STATE.EMAIL, (v ?? '').trim()); await clearTokens(sm); }
                })
            }),
            App.createDUISecureInputField({
                id: exports.STATE.PASSWORD,
                label: 'Password',
                value: App.createDUIBinding({
                    get: async () => (await sm.keychain.retrieve(exports.STATE.PASSWORD)) ?? '',
                    set: async (v) => { await sm.keychain.store(exports.STATE.PASSWORD, (v ?? '').trim()); await clearTokens(sm); }
                })
            }),
            App.createDUISwitch({
                id: exports.STATE.SHOW_LOCKED,
                label: 'Show locked (premium) chapters',
                value: App.createDUIBinding({
                    get: async () => (await sm.retrieve(exports.STATE.SHOW_LOCKED)) ?? false,
                    set: async (v) => { await sm.store(exports.STATE.SHOW_LOCKED, v); }
                })
            }),
            App.createDUIButton({
                id: 'relogin',
                label: 'Re-login (clear saved tokens)',
                onTap: async () => { await clearTokens(sm); }
            })
        ]
    });
}
exports.getSourceMenu = getSourceMenu;

},{}]},{},[62])(62)
});
