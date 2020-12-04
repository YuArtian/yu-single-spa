import { started } from "../start";

export function reroute(){
  if (started) {
    // app装载
    return performAppChanges()
  } else {
    // 注册应用 预先加载
    return loadApps()
  }
  // 预加载应用
  async function loadApps(){}
  // 根据路径加载应用
  async function performAppChanges(){}

}