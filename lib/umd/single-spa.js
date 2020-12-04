(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
}(this, (function (exports) { 'use strict';

  // 子应用列表
  const apps = [];

  /**
   * registerApplication 注册加载子应用
   * @export
   * @param {*} appName
   * @param {*} loadApp
   * @param {*} activeWhen
   * @param {*} customProps
   */
  function registerApplication (appName, loadApp, activeWhen, customProps) {
    apps.push({
      name: appName,
      loadApp, activeWhen, customProps
    });
    console.log('app',apps);
  }

  function start(){}

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
