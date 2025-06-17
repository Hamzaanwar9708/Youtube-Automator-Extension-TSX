"use strict";
self["webpackHotUpdatechrome_extension_boilerplate_react"]("contentScript",{

/***/ "./src/pages/Content/index.ts":
/*!************************************!*\
  !*** ./src/pages/Content/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Popup_icon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Popup/icon */ "./src/pages/Content/Popup/icon.tsx");
/* harmony import */ var _Content_Sections_Multiple_MultipleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Content/Sections/Multiple/MultipleSection */ "./src/pages/Content/Sections/Multiple/MultipleSection.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


(0,_Popup_icon__WEBPACK_IMPORTED_MODULE_0__.injectIcon)();
function getCheckLink() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => chrome.storage.local.get('check', (d) => res(d.check || null)));
    });
}
function getVideoId(href) {
    try {
        const u = new URL(href, window.location.href);
        const v = u.searchParams.get('v');
        if (v && v.length === 11)
            return v;
        if (u.hostname === 'youtu.be' && u.pathname.length === 12)
            return u.pathname.slice(1);
        return null;
    }
    catch (_a) {
        return null;
    }
}
let processedLinksMemory = [];
chrome.storage.local.get('processedLinks', (d) => {
    processedLinksMemory = d.processedLinks || [];
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function showCompletedModal() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.classList.add('modal-overlay');
            const container = document.createElement('div');
            container.classList.add('modal-container');
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '×';
            closeBtn.classList.add('modal-close-btn');
            const title = document.createElement('h2');
            title.innerText = '🎉 Task Completed!';
            title.classList.add('modal-title');
            const message = document.createElement('p');
            message.innerText = 'Your task was successfully completed.';
            message.classList.add('modal-message');
            const ok = document.createElement('button');
            ok.innerText = 'OK';
            ok.classList.add('modal-ok-btn');
            container.append(closeBtn, title, message, ok);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            const cleanup = () => {
                overlay.remove();
                chrome.runtime.sendMessage({ action: 'completedModalClosed' });
                resolve();
            };
            closeBtn.addEventListener('click', cleanup);
            ok.addEventListener('click', cleanup);
        });
    });
}
function findProcessedLink(link, field) {
    return __awaiter(this, void 0, void 0, function* () {
        const vid = getVideoId(link);
        if (!vid)
            return;
        let obj = processedLinksMemory.find((i) => getVideoId(i.link) === vid);
        const { channellinkLists = [] } = yield new Promise((resolve) => chrome.storage.local.get('channellinkLists', resolve));
        const isFromChannel = channellinkLists.some((c) => c.link === link);
        if (!obj) {
            obj = {
                link: `https://www.youtube.com/watch?v=${vid}`,
                subscribed: isFromChannel,
                liked: false,
                commented: false,
            };
            processedLinksMemory.push(obj);
        }
        if (!obj[field]) {
            obj[field] = true;
            yield new Promise((res) => chrome.storage.local.set({ processedLinks: processedLinksMemory }, res));
        }
    });
}
function openFirstVideoAndThen(action) {
    return __awaiter(this, void 0, void 0, function* () {
        const el = document.querySelector('ytd-rich-grid-media a');
        const h = el === null || el === void 0 ? void 0 : el.getAttribute('href');
        if (h)
            chrome.runtime.sendMessage({
                action: 'openSingleVideoTab',
                link: `https://www.youtube.com${h}`,
                nextAction: action,
            });
    });
}
function getTabId() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => chrome.storage.local.get('singleVideoTabId', (d) => res(d.singleVideoTabId || null)));
    });
}
function waitForElement(selector, timeout = 10000) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            const found = document.querySelector(selector);
            if (found)
                return res(found);
            const o = new MutationObserver(() => {
                const f = document.querySelector(selector);
                if (f) {
                    o.disconnect();
                    res(f);
                }
            });
            o.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                o.disconnect();
                rej();
            }, timeout);
        });
    });
}
function sub() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const link = yield getCheckLink();
        if (!link)
            return;
        const vid = getVideoId(link);
        const proc = processedLinksMemory.find((p) => getVideoId(p.link) === vid);
        if (proc === null || proc === void 0 ? void 0 : proc.subscribed) {
            return;
        }
        yield sleep(2000);
        window.scrollTo({ top: 150, behavior: 'smooth' });
        const btn = (yield waitForElement('ytd-subscribe-button-renderer button'));
        if (((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === 'Subscribe') {
            btn.click();
            yield findProcessedLink(link, 'subscribed');
        }
    });
}
function like() {
    return __awaiter(this, void 0, void 0, function* () {
        const link = yield getCheckLink();
        if (!link)
            return;
        const vid = getVideoId(link);
        const proc = processedLinksMemory.find((p) => getVideoId(p.link) === vid);
        if (proc === null || proc === void 0 ? void 0 : proc.liked) {
            return;
        }
        yield sleep(2000);
        window.scrollTo({ top: 200, behavior: 'smooth' });
        const btn = (yield waitForElement('like-button-view-model button'));
        if (btn.title === 'I like this') {
            btn.click();
            yield findProcessedLink(link, 'liked');
        }
    });
}
function comments() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const link = yield getCheckLink();
        if (!link)
            return;
        const vid = getVideoId(link);
        const proc = processedLinksMemory.find((p) => getVideoId(p.link) === vid);
        if (proc === null || proc === void 0 ? void 0 : proc.commented) {
            chrome.runtime.sendMessage({ action: 'actionDone', type: 'comment' });
            return;
        }
        yield sleep(2000);
        window.scrollTo({ top: 500, behavior: 'smooth' });
        const t = (_a = (yield waitForElement('ytd-watch-metadata yt-formatted-string')).textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (t) {
            chrome.runtime.sendMessage({ action: 'generatecomment', videoTitle: t });
        }
    });
}
function postComment(c) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        window.scrollTo({ top: 500, behavior: 'smooth' });
        const box = yield waitForElement('ytd-comments div#simple-box yt-formatted-string');
        if (!box) {
            chrome.runtime.sendMessage({ action: 'actionDone', type: 'comment' });
        }
        else {
            box.click();
            document.execCommand('insertText', false, c);
            yield sleep(2000);
            (_a = document
                .querySelector('div#footer #buttons #submit-button')) === null || _a === void 0 ? void 0 : _a.click();
            yield findProcessedLink(window.location.href, 'commented');
        }
    });
}
function findChannel() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const ytdInput = document.querySelector('#center yt-searchbox div form input');
        if (!ytdInput) {
            const msg = 'YouTube search input not found.';
            throw new Error(msg);
        }
        ytdInput.click();
        const stored = yield new Promise((res, rej) => chrome.storage.local.get('ytdChannel', (result) => {
            if (chrome.runtime.lastError)
                rej(chrome.runtime.lastError);
            else
                res(result.ytdChannel || '');
        }));
        ytdInput.focus();
        ytdInput.value = stored;
        ytdInput.dispatchEvent(new Event('input', { bubbles: true }));
        yield sleep(3000);
        const searchBtn = document.querySelector('ytd-masthead #center button.ytSearchboxComponentSearchButton');
        if (!searchBtn)
            throw new Error('YouTube search button not found.');
        searchBtn.click();
        yield sleep(5000);
        const contentSection = document.getElementById('content-section');
        if (!contentSection) {
            const msg = 'YouTube channel not found.';
            throw new Error(msg);
        }
        const channelAnchors = document.querySelector('#avatar-section a');
        yield sleep(5000);
        if (channelAnchors) {
            channelAnchors.click();
        }
        else {
            console.error('No channels found in the search results.');
        }
        yield sleep(5000);
        const parent = document.querySelector('#tabsContent yt-tab-group-shape .yt-tab-group-shape-wiz__tabs');
        const videoTab = parent === null || parent === void 0 ? void 0 : parent.querySelectorAll('.yt-tab-shape-wiz')[1];
        if (videoTab) {
            yield sleep(3000);
            videoTab.click();
            yield sleep(3000);
            const btn = (yield waitForElement('ytd-subscribe-button-renderer button'));
            if (((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === 'Subscribe') {
                yield sleep(3000);
                btn.click();
            }
            yield sleep(3000);
            const rootSelector = 'ytd-two-column-browse-results-renderer[page-subtype="channels"] ytd-rich-grid-renderer #contents';
            const firstVideo = Array.from(document.querySelectorAll(`${rootSelector} ytd-rich-item-renderer ytd-rich-grid-media a#thumbnail`));
            if (firstVideo) {
                const channellinkLists = [];
                chrome.storage.local.get(['channelRangeObj'], (result) => {
                    var _a, _b, _c, _d;
                    const start = (_b = (_a = result === null || result === void 0 ? void 0 : result.channelRangeObj) === null || _a === void 0 ? void 0 : _a.min) !== null && _b !== void 0 ? _b : 0;
                    const end = (_d = (_c = result === null || result === void 0 ? void 0 : result.channelRangeObj) === null || _c === void 0 ? void 0 : _c.max) !== null && _d !== void 0 ? _d : 10;
                    for (let i = start - 1; i < end && i < firstVideo.length; i++) {
                        const el = firstVideo[i * 2];
                        if (!el || !el.href) {
                            console.warn(`Skipping undefined or invalid video at index ${i}`);
                            continue;
                        }
                        const videoLink = el.href;
                        channellinkLists.push({
                            id: (0,_Content_Sections_Multiple_MultipleSection__WEBPACK_IMPORTED_MODULE_1__.generateRandomId)(),
                            link: videoLink,
                            subscribed: true,
                            liked: false,
                            commented: false,
                        });
                    }
                    chrome.storage.local.set({ channellinkLists });
                    console.log(channellinkLists);
                    chrome.runtime.sendMessage({
                        action: 'PlayChannelVideos',
                        links: channellinkLists,
                    });
                });
            }
            else {
                throw new Error('Video tab not found');
            }
        }
    });
}
chrome.runtime.onMessage.addListener((msg) => __awaiter(void 0, void 0, void 0, function* () {
    switch (msg.action) {
        case 'OpenFirstVideo&Subscribe':
            openFirstVideoAndThen('Subscribe');
            break;
        case 'OpenFirstVideo&Like':
            openFirstVideoAndThen('Like');
            break;
        case 'OpenFirstVideo&Comment':
            openFirstVideoAndThen('Comment');
            break;
        case 'OpenFirstVideo&SLC':
            openFirstVideoAndThen('SLC');
            break;
        case 'Subscribe':
            yield sleep(2000);
            yield sub();
            yield sleep(8000);
            chrome.runtime.sendMessage({ action: 'actionDone', type: 'sub' });
            break;
        case 'Like':
            yield sleep(2000);
            yield like();
            yield sleep(8000);
            chrome.runtime.sendMessage({ action: 'actionDone', type: 'like' });
            break;
        case 'Comment':
            yield sleep(2000);
            yield comments();
            break;
        case 'SLC':
            yield sleep(2000);
            yield sub();
            yield sleep(3000);
            yield like();
            yield sleep(3000);
            yield comments();
            break;
        case 'postGeneratedComment':
            if (msg.comment) {
                yield postComment(msg.comment);
                yield sleep(8000);
                chrome.runtime.sendMessage({ action: 'actionDone', type: 'comment' });
            }
            break;
        case 'FindChannel':
            yield sleep(2000);
            yield findChannel();
            break;
        case 'showCompletedModal':
            yield showCompletedModal();
            break;
        case 'Notify':
            chrome.runtime.sendMessage({ action: 'actionDone' });
            break;
    }
}));


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1ec225e281ad7b48ac76")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=contentScript.af74742355f71e88f890.hot-update.js.map