(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
}(this, (function (exports) { 'use strict';

  //状态控制
  let started = false;
  //挂载子应用
  function start(){
    started = true;
    reroute();
  }

  // single-spa 状态
  const NOT_LOADED = 'NOT_LOADED';
  const LOAD_ERROR$1 = 'LOAD_ERROR';
  const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE';
  const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED';
  const BOOTSTRAPPING = 'BOOTSTRAPPING';
  const NOT_MOUNTED = 'NOT_MOUNTED';
  const MOUNTING = 'MOUNTING';
  const MOUNTED = 'MOUNTED';
  const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN';
  //当前应用是否需要激活
  function shouldBeActive (app) {
    return app.activeWhen(window.location)
  }

  function flattenFnArray (appOrParcel, lifecycle) {
    let fns = appOrParcel[lifecycle] || [];
    fns = Array.isArray(fns) || [];
    if (fns.length === 0) {
      fns = [() => Promise.resolve()];
    }
    return (props) => fns.reduce((resultPromise, fn, index) => {
      return resultPromise.then(() => fn(props))
    }, Promise.resolve())
  }

  /**
   * 异步加载 app
   */
  async function toLoadPromise(app){
    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return app;
    }
    app.status = LOADING_SOURCE_CODE;
    // 各种验证合法性的方法
    // 调用 loadApp 返回约定的生命周期方法
    let appOpts = await app.loadApp(app.customProps);
    app.status = NOT_BOOTSTRAPPED;
    app.bootstarp = flattenFnArray(appOpts, 'bootstarp');
    app.mount = flattenFnArray(appOpts, 'mount');
    app.unmount = flattenFnArray(appOpts, 'unmount');
    app.unload = flattenFnArray(appOpts, 'unload');
    delete app.loadPromise;
    return app
  }

  async function toUnmountPromise () {

  }

  async function toBootstrapPromise(appOrParcel){
    if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }
    appOrParcel.status = BOOTSTRAPPING;
    await appOrParcel.bootstrap(appOrParcel.customProps);
    appOrParcel.status = NOT_MOUNTED;
    return appOrParcel
  }

  async function toMountPromise(){
    if (appOrParcel.status !== NOT_MOUNTED) {
      return appOrParcel;
    }
    appOrParcel.status = MOUNTING;
    await appOrParcel.mount(appOrParcel.customProps);
    appOrParcel.status = MOUNTED;
    return appOrParcel
  }

  function reroute(){
    const { appsToLoad, appsToMount, appsToUnload, appsToUnmount } = getAppChanges();
    console.log('appsToLoad, appsToMount, appsToUnload, appsToUnmount', appsToLoad, appsToMount, appsToUnload, appsToUnmount);
    if (started) {
      // app装载
      return performAppChanges()
    } else {
      // 注册应用 预先加载
      return loadApps()
    }
    // 预加载应用
    async function loadApps(){
      const apps = await Promise.all(appsToLoad.map(toLoadPromise));
      console.log('apps',apps);
    }
    // 根据路径加载应用
    async function performAppChanges(){
      // 卸载需要卸载的应用
      let unmountPromise = appsToUnmount.map(toUnmountPromise);
      // 加载应用
      appsToLoad.map(async (app) => {
        //加载
        app = await toLoadPromise(app);
        //启动
        app = await toBootstrapPromise(app);
        //装载
        app = await toMountPromise();
        return app
      });
      // 挂载已加载的应用
      appsToMount.map(async (app) => {
        app = await toBootstrapPromise(app);
        app = await toMountPromise();
        return app
      });

    }

  }

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
      loadApp,
      activeWhen,
      customProps,
      status: NOT_LOADED,
      loadErrorTime: null
    });
    // 加载应用
    reroute();
  }

  /**
   * 根据app状态分类
   * @export
   * @returns
   */
  function getAppChanges(){
    const appsToUnload = [],
    appsToUnmount = [],
    appsToLoad = [],
    appsToMount = [];

    const currentTime = new Date().getTime();
    apps.forEach((app) => {
      const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);
      switch (app.status) {
        case LOAD_ERROR$1:
          if (appShouldBeActive && currentTime - app.loadErrorTime >= 200) {
            appsToLoad.push(app);
          }
          break;
        case NOT_LOADED:
        case LOADING_SOURCE_CODE:
          if (appShouldBeActive) {
            appsToLoad.push(app);
          }
          break;
        case NOT_BOOTSTRAPPED:
        case NOT_MOUNTED:
          if (!appShouldBeActive && getAppUnloadInfo(toName(app))) {
            appsToUnload.push(app);
          } else if (appShouldBeActive) {
            appsToMount.push(app);
          }
          break;
        case MOUNTED:
          if (!appShouldBeActive) {
            appsToUnmount.push(app);
          }
          break;
      }
    });
    return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
  }

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
