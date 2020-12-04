// single-spa 状态
export const NOT_LOADED = 'NOT_LOADED'
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'
export const BOOTSTRAPPING = 'BOOTSTRAPPING'
export const NOT_MOUNTED = 'NOT_MOUNTED'
export const MOUNTING = 'MOUNTING'
export const MOUNTED = 'MOUNTED'
export const UPDATING = 'UPDATING'
export const UNMOUNTING = 'UNMOUNTING'
export const UNLOADING = 'UNLOADING'
export const LOAD_ERR = 'LOAD_ERR'
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'

// 当前应用是否被激活
export function isActive (app) {
  return app.status === MOUNTED
}
//当前应用是否需要激活
export function shouldBeActive (app) {
  return app.activeWhen(window.location)
}
