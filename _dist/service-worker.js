/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/messaging.ts":
/*!******************************!*\
  !*** ./src/lib/messaging.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCallable: () => (/* binding */ getCallable),
/* harmony export */   readLocalStorage: () => (/* binding */ readLocalStorage),
/* harmony export */   registerListener: () => (/* binding */ registerListener),
/* harmony export */   setLocalStorage: () => (/* binding */ setLocalStorage)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const globalCallbacks = new Map();
function registerListener(name, fn) {
    globalCallbacks.set(name, fn);
}
function getCallable(key) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        return (yield chrome.runtime.sendMessage({ key, args }));
    });
}
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    var _a;
    if (globalCallbacks.has(request.key)) {
        const fn = globalCallbacks.get(request.key);
        void fn(...((_a = request.args) !== null && _a !== void 0 ? _a : []))
            .then((result) => {
            sendResponse({ success: true, result });
        })
            .catch((_error) => {
            sendResponse({ success: false, result: undefined });
        });
        return true;
    }
    return false;
});
const readLocalStorage = getCallable('lsr');
const setLocalStorage = getCallable('lsw');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/service-worker.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_messaging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lib/messaging */ "./src/lib/messaging.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

(0,_lib_messaging__WEBPACK_IMPORTED_MODULE_0__.registerListener)('lsr', (key, defaultValue) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield chrome.storage.local.get(key);
    return (_b = ((_a = result === null || result === void 0 ? void 0 : result[key]) !== null && _a !== void 0 ? _a : defaultValue)) !== null && _b !== void 0 ? _b : undefined;
}));
(0,_lib_messaging__WEBPACK_IMPORTED_MODULE_0__.registerListener)('lsw', (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    yield chrome.storage.local.set({ [key]: value });
}));

})();

/******/ })()
;
//# sourceMappingURL=service-worker.js.map