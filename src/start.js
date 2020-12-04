import { reroute } from "./navigations/reroute";

//状态控制
export let started = false
//挂载子应用
export function start(){
  started = true
  reroute()
}