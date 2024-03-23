/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/apps/google.ts ***!
  \****************************/
(() => {
    const button = new DOMParser().parseFromString('<button>Click to open side panel</button>', 'text/html').body.firstElementChild;
    button.addEventListener('click', function () {
        void chrome.runtime.sendMessage({ type: 'open_side_panel' });
    });
    document.body.append(button);
})();

/******/ })()
;
//# sourceMappingURL=google.js.map