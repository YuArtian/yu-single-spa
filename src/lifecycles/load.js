import { LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED, NOT_LOADED } from "../applications/app.helper";
import { flattenFnArray } from "./lifecycle.helpers";

/**
 * 异步加载 app
 */
export async function toLoadPromise(app){
  if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
    return app;
  }
  app.status = LOADING_SOURCE_CODE
  // 各种验证合法性的方法
  // 调用 loadApp 返回约定的生命周期方法
  let appOpts = await app.loadApp(app.customProps)
  app.status = NOT_BOOTSTRAPPED
  app.bootstarp = flattenFnArray(appOpts, 'bootstarp')
  app.mount = flattenFnArray(appOpts, 'mount')
  app.unmount = flattenFnArray(appOpts, 'unmount')
  app.unload = flattenFnArray(appOpts, 'unload')
  delete app.loadPromise;
  return app
}