import { reroute } from "../navigations/reroute"
import { NOT_LOADED } from "./app.helper"

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
    status: NOT_LOADED
  })
  console.log('app',apps)
  // 加载应用
  reroute()
}
