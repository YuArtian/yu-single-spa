import { started } from "../start";
import { getAppChanges } from '../applications/app'
import { toLoadPromise } from "../lifecycles/load";
import { toUnmountPromise } from "../lifecycles/unmount";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toMountPromise } from "../lifecycles/mount";

export function reroute(){
  const { appsToLoad, appsToMount, appsToUnload, appsToUnmount } = getAppChanges()
  console.log('appsToLoad, appsToMount, appsToUnload, appsToUnmount', appsToLoad, appsToMount, appsToUnload, appsToUnmount)
  if (started) {
    // app装载
    return performAppChanges()
  } else {
    // 注册应用 预先加载
    return loadApps()
  }
  // 预加载应用
  async function loadApps(){
    const apps = await Promise.all(appsToLoad.map(toLoadPromise))
    console.log('apps',apps)
  }
  // 根据路径加载应用
  async function performAppChanges(){
    // 卸载需要卸载的应用
    let unmountPromise = appsToUnmount.map(toUnmountPromise)
    // 加载应用
    appsToLoad.map(async (app) => {
      //加载
      app = await toLoadPromise(app)
      //启动
      app = await toBootstrapPromise(app)
      //装载
      app = await toMountPromise(app)
      return app
    })
    // 挂载已加载的应用
    appsToMount.map(async (app) => {
      app = await toBootstrapPromise(app)
      app = await toMountPromise(app)
      return app
    })

  }

}
