
export function flattenFnArray (appOrParcel, lifecycle) {
  let fns = appOrParcel[lifecycle] || [];
  fns = Array.isArray(fns) || []
  if (fns.length === 0) {
    fns = [() => Promise.resolve()];
  }
  return (props) => fns.reduce((resultPromise, fn, index) => {
    return resultPromise.then(() => fn(props))
  }, Promise.resolve())
}