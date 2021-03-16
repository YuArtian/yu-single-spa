import { MOUNTED, MOUNTING, NOT_MOUNTED } from "../applications/app.helper";

export async function toMountPromise(){
  if (appOrParcel.status !== NOT_MOUNTED) {
    return appOrParcel;
  }
  appOrParcel.status = MOUNTING
  await appOrParcel.mount(appOrParcel.customProps)
  appOrParcel.status = MOUNTED
  return appOrParcel
}