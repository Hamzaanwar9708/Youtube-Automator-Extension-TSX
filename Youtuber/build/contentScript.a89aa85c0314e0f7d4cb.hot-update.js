"use strict";
self["webpackHotUpdatechrome_extension_boilerplate_react"]("contentScript",{

/***/ "./src/pages/Content/Sections/filter/FilterSection.tsx":
/*!*************************************************************!*\
  !*** ./src/pages/Content/Sections/filter/FilterSection.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../styles */ "./src/pages/Content/styles.tsx");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../button */ "./src/pages/Content/button.tsx");
/* harmony import */ var _Modals_FinalModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Modals/FinalModal */ "./src/pages/Content/Modals/FinalModal.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




const MULTIPLE_KEYS = {
    MAIN: 'mainMultipleLinks',
    RANGE: 'rangeMultipleLinks',
    ACTION: 'multipleActionLinks',
};
const PLAYLIST_KEYS = {
    PROCESSED: 'playlistProcessedLinks',
    RANGE: 'playlistRangeLinks',
    ACTION: 'playlistActionLinks',
};
const FilterSection = ({ onSectionChange, goBack, rememberPrevious }) => {
    const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
    const [currentErrorKey, setCurrentErrorKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [availableLinks, setAvailableLinks] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (rememberPrevious === 2) {
            chrome.storage.local.get([MULTIPLE_KEYS.MAIN], result => {
                var _a;
                setAvailableLinks((_a = result[MULTIPLE_KEYS.MAIN]) !== null && _a !== void 0 ? _a : []);
            });
        }
        else if (rememberPrevious === 3) {
            chrome.storage.local.get([PLAYLIST_KEYS.PROCESSED], result => {
                var _a;
                setAvailableLinks((_a = result[PLAYLIST_KEYS.PROCESSED]) !== null && _a !== void 0 ? _a : []);
            });
        }
    }, [rememberPrevious]);
    const validate = () => {
        var _a, _b;
        const newErrors = {};
        const mainMin = Number((_a = document.getElementById('main-min')) === null || _a === void 0 ? void 0 : _a.value) || 0;
        const mainMax = Number((_b = document.getElementById('main-max')) === null || _b === void 0 ? void 0 : _b.value) || 0;
        const ranges = ['subscribe', 'like', 'comment'];
        const minAllowed = availableLinks.length > 0 ? 1 : 0;
        const maxAllowed = availableLinks.length;
        if (mainMin > mainMax) {
            newErrors['main'] = 'Minimum value cannot exceed maximum value.';
        }
        else if (mainMin < minAllowed) {
            newErrors['main'] = `Minimum value cannot be less than ${minAllowed}.`;
        }
        else if (mainMax > maxAllowed) {
            newErrors['main'] = `Maximum value cannot exceed ${maxAllowed}.`;
        }
        ranges.forEach(range => {
            var _a, _b;
            const min = Number((_a = document.getElementById(`${range}-min`)) === null || _a === void 0 ? void 0 : _a.value);
            const max = Number((_b = document.getElementById(`${range}-max`)) === null || _b === void 0 ? void 0 : _b.value);
            if (min > max) {
                newErrors[range] = 'Minimum value cannot exceed maximum value.';
            }
            else if (min < mainMin && min != n) {
                newErrors[range] = 'Minimum must be at least the main range minimum.';
            }
            else if (min > mainMax) {
                newErrors[range] = 'Minimum cannot exceed the main range maximum.';
            }
            else if (max < mainMin) {
                newErrors[range] = 'Maximum must be at least the main range minimum.';
            }
            else if (max > mainMax) {
                newErrors[range] = 'Maximum cannot exceed the main range maximum.';
            }
        });
        setErrors(newErrors);
        const firstKey = Object.keys(newErrors)[0] || null;
        if (firstKey) {
            setCurrentErrorKey(firstKey);
            return false;
        }
        return true;
    };
    const getInputStyle = (key) => (Object.assign(Object.assign({}, _styles__WEBPACK_IMPORTED_MODULE_1__.filterInputStyle), { border: errors[key] ? '2px solid red' : undefined }));
    const handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!validate())
            return;
        const mainMin = Number((_a = document.getElementById('main-min')) === null || _a === void 0 ? void 0 : _a.value);
        const mainMax = Number((_b = document.getElementById('main-max')) === null || _b === void 0 ? void 0 : _b.value);
        const subscribeMin = Number((_c = document.getElementById('subscribe-min')) === null || _c === void 0 ? void 0 : _c.value);
        const subscribeMax = Number((_d = document.getElementById('subscribe-max')) === null || _d === void 0 ? void 0 : _d.value);
        const likeMin = Number((_e = document.getElementById('like-min')) === null || _e === void 0 ? void 0 : _e.value);
        const likeMax = Number((_f = document.getElementById('like-max')) === null || _f === void 0 ? void 0 : _f.value);
        const commentMin = Number((_g = document.getElementById('comment-min')) === null || _g === void 0 ? void 0 : _g.value);
        const commentMax = Number((_h = document.getElementById('comment-max')) === null || _h === void 0 ? void 0 : _h.value);
        const adjustedMainMin = mainMin - 1;
        const adjustedMainMax = mainMax;
        const rangeLinks = availableLinks.slice(adjustedMainMin, adjustedMainMax);
        const subscribeLinks = availableLinks.slice(subscribeMin - 1, subscribeMax);
        const likeLinks = availableLinks.slice(likeMin - 1, likeMax);
        const commentLinks = availableLinks.slice(commentMin - 1, commentMax);
        const actionLinks = {
            subscribe: subscribeLinks,
            like: likeLinks,
            comment: commentLinks,
        };
        const storageItems = {};
        if (rememberPrevious === 2) {
            storageItems[MULTIPLE_KEYS.RANGE] = rangeLinks;
            storageItems[MULTIPLE_KEYS.ACTION] = actionLinks;
        }
        else if (rememberPrevious === 3) {
            storageItems[PLAYLIST_KEYS.RANGE] = rangeLinks;
            storageItems[PLAYLIST_KEYS.ACTION] = actionLinks;
        }
        yield chrome.storage.local.set(storageItems);
        goBack();
    });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "filter-section", style: _styles__WEBPACK_IMPORTED_MODULE_1__.filterSectionStyle },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: "link-count" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
                "Links Count: ",
                availableLinks.length > 0
                    ? `1 to ${availableLinks.length}`
                    : `0 to ${availableLinks.length}`)),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: "main-range", style: _styles__WEBPACK_IMPORTED_MODULE_1__.filterGroupStyle },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: _styles__WEBPACK_IMPORTED_MODULE_1__.filterLabelStyle }, "Main"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { type: "number", id: "main-min", style: getInputStyle('main') }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { type: "number", id: "main-max", style: getInputStyle('main') })),
        ['subscribe', 'like', 'comment'].map(range => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: range, id: `${range}-range`, style: _styles__WEBPACK_IMPORTED_MODULE_1__.filterGroupStyle },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: _styles__WEBPACK_IMPORTED_MODULE_1__.filterLabelStyle }, range.charAt(0).toUpperCase() + range.slice(1)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { type: "number", id: `${range}-min`, style: getInputStyle(range) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { type: "number", id: `${range}-max`, style: getInputStyle(range) })))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: "range-btn", style: _styles__WEBPACK_IMPORTED_MODULE_1__.filterButtonContainerStyle },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_2__["default"], { btnId: "submit-btn", onClick: handleSubmit, customStyle: { width: '140px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, "Submit"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button__WEBPACK_IMPORTED_MODULE_2__["default"], { btnId: "back-btn", onClick: goBack, customStyle: { width: '140px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, "Back")),
        currentErrorKey && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Modals_FinalModal__WEBPACK_IMPORTED_MODULE_3__["default"], { mode: "filter-error", message: errors[currentErrorKey], onClose: () => setCurrentErrorKey(null) }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterSection);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4b576228bb160e3b6b25")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=contentScript.a89aa85c0314e0f7d4cb.hot-update.js.map