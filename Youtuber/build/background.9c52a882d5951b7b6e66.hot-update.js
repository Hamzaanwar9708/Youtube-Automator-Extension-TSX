"use strict";
self["webpackHotUpdatechrome_extension_boilerplate_react"]("background",{

/***/ "./src/pages/Background/index.ts":
/*!***************************************!*\
  !*** ./src/pages/Background/index.ts ***!
  \***************************************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let openedTabId = null;
let SingleFlag = false;
let MultipleFlag = false;
let PlaylistFlag = false;
let ChannelFlag = false;
const OPENAI_API_KEY = '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';
const STORAGE_KEYS = {
    MAIN: 'mainMultipleLinks',
    RANGE: 'rangeMultipleLinks',
    ACTION: 'multipleActionLinks',
    PROCESSED: 'processedLinks',
    PLAYLIST_PROCESSED: 'playlistProcessedLinks',
    PLAYLIST_RANGE: 'playlistRangeLinks',
    PLAYLIST_ACTIONS: 'playlistActionLinks',
    CHANNEL: 'channellinkLists',
};
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let multipleQueue = [];
let multipleActions = { subscribe: [], like: [], comment: [] };
let multipleIsRange = false;
let playlistQueue = [];
let playlistActions = { subscribe: [], like: [], comment: [] };
let playlistIsRange = false;
let channelQueue = [];
function openTab(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(url);
        const check = url;
        yield chrome.storage.local.set({ check });
        const tab = yield new Promise((res) => chrome.tabs.create({ url, active: true }, res));
        openedTabId = tab.id;
        yield chrome.storage.local.set({ singleVideoTabId: openedTabId });
        yield delay(2000);
        return openedTabId;
    });
}
function sendToTab(action) {
    if (openedTabId != null) {
        chrome.tabs.sendMessage(openedTabId, { action });
    }
}
chrome.runtime.onMessage.addListener((message) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, link, nextAction, videoTitle } = message;
    switch (action) {
        case 'Subscribe':
        case 'Like':
        case 'Comment':
        case 'SLC':
            SingleFlag = true;
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                var _a;
                const t = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id;
                if (t != null)
                    chrome.tabs.sendMessage(t, {
                        action: action === 'SLC'
                            ? 'OpenFirstVideo&SLC'
                            : `OpenFirstVideo&${action}`,
                    });
            });
            break;
        case 'StartAutomationMultiple':
            MultipleFlag = true;
            if (openedTabId)
                chrome.tabs.remove(openedTabId);
            {
                const stored = yield chrome.storage.local.get([
                    STORAGE_KEYS.MAIN,
                    STORAGE_KEYS.RANGE,
                    STORAGE_KEYS.ACTION,
                ]);
                const mainQ = stored[STORAGE_KEYS.MAIN] || [];
                const rangeQ = stored[STORAGE_KEYS.RANGE] || [];
                const acts = stored[STORAGE_KEYS.ACTION] || {
                    subscribe: [],
                    like: [],
                    comment: [],
                };
                multipleIsRange = rangeQ.length > 0;
                multipleQueue = multipleIsRange ? rangeQ : mainQ;
                multipleActions = acts;
            }
            initMultipleProcessing();
            break;
        case 'StartAutomationPlaylist':
            PlaylistFlag = true;
            if (openedTabId)
                chrome.tabs.remove(openedTabId);
            {
                const stored = yield chrome.storage.local.get([
                    STORAGE_KEYS.PLAYLIST_PROCESSED,
                    STORAGE_KEYS.PLAYLIST_RANGE,
                    STORAGE_KEYS.PLAYLIST_ACTIONS,
                ]);
                const procQ = stored[STORAGE_KEYS.PLAYLIST_PROCESSED] || [];
                const rangeQ = stored[STORAGE_KEYS.PLAYLIST_RANGE] || [];
                const acts = stored[STORAGE_KEYS.PLAYLIST_ACTIONS] || {
                    subscribe: [],
                    like: [],
                    comment: [],
                };
                playlistIsRange = rangeQ.length > 0;
                playlistQueue = playlistIsRange ? rangeQ : procQ;
                playlistActions = acts;
            }
            initPlaylistProcessing();
            break;
        case 'PlayChannelVideos':
            ChannelFlag = true;
            if (openedTabId)
                chrome.tabs.remove(openedTabId);
            const stored = yield chrome.storage.local.get([STORAGE_KEYS.CHANNEL]);
            channelQueue = stored[STORAGE_KEYS.CHANNEL] || [];
            initChannelProcessing();
            break;
        case 'SearchChannel':
            ChannelFlag = true;
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                var _a;
                const t = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id;
                if (t != null)
                    chrome.tabs.sendMessage(t, { action: 'FindChannel' });
            });
            break;
        case 'openSingleVideoTab':
            if (link && nextAction) {
                const check = link;
                yield chrome.storage.local.set({ check });
                const tab = yield new Promise((res) => chrome.tabs.create({ url: link, active: true }, res));
                openedTabId = tab.id;
                chrome.storage.local.set({ singleVideoTabId: openedTabId });
                chrome.tabs.onUpdated.addListener(function listener(id, info) {
                    if (id === openedTabId && info.status === 'complete') {
                        sendToTab(nextAction);
                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                });
            }
            break;
        case 'actionDone':
            if (SingleFlag) {
                sendToTab('showCompletedModal');
            }
            else if (MultipleFlag) {
                const isLast = multipleQueue.length === 1;
                const current = multipleQueue.shift();
                if (current) {
                    const mem = yield chrome.storage.local.get(STORAGE_KEYS.PROCESSED);
                    const proc = mem[STORAGE_KEYS.PROCESSED] || [];
                    const idx = proc.findIndex((i) => i.id === current.id);
                    if (idx >= 0)
                        proc[idx] = Object.assign({}, current);
                    else
                        proc.push(Object.assign({}, current));
                    yield chrome.storage.local.set({ [STORAGE_KEYS.PROCESSED]: proc });
                    const key = multipleIsRange ? STORAGE_KEYS.RANGE : STORAGE_KEYS.MAIN;
                    yield chrome.storage.local.set({ [key]: multipleQueue });
                }
                if (isLast) {
                    sendToTab('showCompletedModal');
                }
                else {
                    chrome.tabs.remove(openedTabId);
                    initMultipleProcessing();
                }
            }
            else if (PlaylistFlag) {
                const isLast = playlistQueue.length === 1;
                const current = playlistQueue.shift();
                if (current) {
                    const mem = yield chrome.storage.local.get(STORAGE_KEYS.PLAYLIST_PROCESSED);
                    const proc = mem[STORAGE_KEYS.PLAYLIST_PROCESSED] || [];
                    const idx = proc.findIndex((i) => i.id === current.id);
                    if (idx >= 0)
                        proc[idx] = Object.assign({}, current);
                    else
                        proc.push(Object.assign({}, current));
                    yield chrome.storage.local.set({
                        [STORAGE_KEYS.PLAYLIST_PROCESSED]: proc,
                    });
                    const key = playlistIsRange
                        ? STORAGE_KEYS.PLAYLIST_RANGE
                        : STORAGE_KEYS.PLAYLIST_PROCESSED;
                    yield chrome.storage.local.set({ [key]: playlistQueue });
                }
                if (isLast) {
                    sendToTab('showCompletedModal');
                }
                else {
                    chrome.tabs.remove(openedTabId);
                    initPlaylistProcessing();
                }
            }
            else if (ChannelFlag) {
                const isLast = channelQueue.length === 1;
                const current = channelQueue.shift();
                if (current) {
                    const mem = yield chrome.storage.local.get(STORAGE_KEYS.PROCESSED);
                    const proc = mem[STORAGE_KEYS.PROCESSED] || [];
                    const idx = proc.findIndex((i) => i.id === current.id);
                    if (idx >= 0)
                        proc[idx] = Object.assign({}, current);
                    else
                        proc.push(Object.assign({}, current));
                    yield chrome.storage.local.set({ [STORAGE_KEYS.PROCESSED]: proc });
                    yield chrome.storage.local.set({
                        [STORAGE_KEYS.CHANNEL]: channelQueue,
                    });
                }
                if (isLast) {
                    sendToTab('showCompletedModal');
                }
                else {
                    chrome.tabs.remove(openedTabId);
                    initChannelProcessing();
                }
            }
            break;
        case 'completedModalClosed':
            if (openedTabId)
                chrome.tabs.remove(openedTabId);
            openedTabId = null;
            SingleFlag = false;
            MultipleFlag = false;
            PlaylistFlag = false;
            ChannelFlag = false;
            break;
        case 'generatecomment':
            if (videoTitle) {
                const comment = yield generateAIComment(videoTitle);
                if (comment) {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        var _a;
                        const t = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id;
                        if (t != null)
                            chrome.tabs.sendMessage(t, {
                                action: 'postGeneratedComment',
                                comment,
                            });
                    });
                }
            }
            break;
    }
}));


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("18f7fbacb5308f0d59c7")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=background.9c52a882d5951b7b6e66.hot-update.js.map