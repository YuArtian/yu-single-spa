import { BOOTSTRAPPING, NOT_BOOTSTRAPPED, NOT_MOUNTED } from "../applications/app.helper";

export async function toBootstrapPromise(appOrParcel){
  if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
    return appOrParcel;
  }
  appOrParcel.status = BOOTSTRAPPING
  await appOrParcel.bootstrap(appOrParcel.customProps)
  appOrParcel.status = NOT_MOUNTED
  return appOrParcel
}