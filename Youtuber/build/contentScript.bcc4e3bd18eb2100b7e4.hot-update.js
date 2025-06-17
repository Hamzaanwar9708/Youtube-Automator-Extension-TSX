"use strict";
self["webpackHotUpdatechrome_extension_boilerplate_react"]("contentScript",{

/***/ "./src/pages/Content/index.ts":
/*!************************************!*\
  !*** ./src/pages/Content/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Popup_icon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Popup/icon */ "./src/pages/Content/Popup/icon.tsx");
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
/******/ 	__webpack_require__.h = () => ("61326c72096769cb6532")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=contentScript.bcc4e3bd18eb2100b7e4.hot-update.js.map