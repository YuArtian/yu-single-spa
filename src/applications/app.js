import { reroute } from "../navigations/reroute"
import {
  NOT_LOADED, SKIP_BECAUSE_BROKEN, LOAD_ERROR, LOADING_SOURCE_CODE,
  MOUNTED, NOT_MOUNTED, NOT_BOOTSTRAPPED,
  shouldBeActive
} from "./app.helper"

// 子应用列表
const apps = []

/**
 * registerApplication 注册加载子应用
 * @export
 * @param {*} appName
 * @param {*} loadApp
 * @param {*} activeWhen
 * @param {*} customProps
 */
export function registerApplication (appName, loadApp, activeWhen, customProps) {
  apps.push({
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED,
    loadErrorTime: null
  })
  // 加载应用
  reroute()
}

/**
 * 根据app状态分类
 * @export
 * @returns
 */
export function getAppChanges(){
  const appsToUnload = [],
  appsToUnmount = [],
  appsToLoad = [],
  appsToMount = [];

  const currentTime = new Date().getTime();
  apps.forEach((app) => {
    const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app)
    switch (app.status) {
      case LOAD_ERROR:
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
  })
  return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
}
